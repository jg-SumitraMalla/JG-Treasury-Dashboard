import * as React from "react";
import { Select, Space, Spin, Switch, AutoComplete } from "antd";
import type { AutoCompleteProps } from "antd";
import { BodyText } from "../Typography";

const { Option } = Select;

export interface IdentifierSearchProps {
  /** Current search value */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when search is triggered (Enter pressed or option selected) */
  onSearch?: (value: string) => void;
  /** Available ticker options */
  tickers?: string[];
  /** Available ISIN options */
  isins?: string[];
  /** Available SEDOL options */
  sedols?: string[];
  /** Whether to use tickers mode (true) or ISIN/SEDOL mode (false) */
  useTickers?: boolean;
  /** Callback when ticker/ISIN toggle changes */
  onToggleMode?: (useTickers: boolean) => void;
  /** Current identifier type (when not using tickers) */
  identifierType?: "isin" | "sedol";
  /** Callback when identifier type changes */
  onIdentifierTypeChange?: (type: "isin" | "sedol") => void;
  /** Loading state for tickers */
  loadingTickers?: boolean;
  /** Loading state for identifiers */
  loadingIdentifiers?: boolean;
  /** Placeholder text for ticker mode */
  tickerPlaceholder?: string;
  /** Placeholder text for ISIN/SEDOL mode */
  identifierPlaceholder?: string;
  /** Additional props to pass to the AutoComplete component */
  selectProps?: Omit<AutoCompleteProps, "value" | "onChange" | "onSearch" | "options" | "placeholder">;
  /** Style for the container */
  style?: React.CSSProperties;
  /** Class name for the container */
  className?: string;
}

/**
 * Normalize Bloomberg ticker by appending "2" if needed
 * Pattern: tickers ending with space + single letter (e.g., "002371 C") should become "002371 C2"
 */
const normalizeBBGTicker = (ticker: string): string => {
  // Match pattern: ends with space + single letter (A-Z), not followed by a digit
  // Example: "002371 C" -> "002371 C2", but "002371 C2" stays as "002371 C2"
  const match = ticker.match(/^(.+)\s([A-Z])$/);
  if (match) {
    const [, prefix, letter] = match;
    // Append "2" if it ends with space + single letter (no number after)
    return `${prefix} ${letter}2`;
  }
  return ticker;
};

export const IdentifierSearch: React.FC<IdentifierSearchProps> = ({
  value = "",
  onChange,
  onSearch,
  tickers = [],
  isins = [],
  sedols = [],
  useTickers = true,
  onToggleMode,
  identifierType = "isin",
  onIdentifierTypeChange,
  loadingTickers = false,
  loadingIdentifiers = false,
  tickerPlaceholder = "Search Ticker...",
  identifierPlaceholder,
  selectProps,
  style,
  className,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
  const isSelectingRef = React.useRef<boolean>(false);
  const inputRef = React.useRef<string>("");

  // Get available options based on identifier type or tickers
  const getAvailableOptions = (): string[] => {
    if (useTickers) {
      return tickers;
    }
    return identifierType === "isin" ? isins : sedols;
  };

  // Filter options based on search value (case-sensitive for accuracy)
  const getFilteredOptions = (searchValue: string): string[] => {
    const options = getAvailableOptions();
    if (!searchValue.trim()) return options;

    return options.filter((option) => option.includes(searchValue));
  };

  const handleSelect = (selectedValue: string) => {
    const normalizedValue = useTickers
      ? normalizeBBGTicker(selectedValue)
      : selectedValue.trim();

    onChange?.(selectedValue);
    inputRef.current = selectedValue;
    isSelectingRef.current = true;
    setDropdownOpen(false);

    // Trigger search with normalized value
    onSearch?.(normalizedValue);

    // Clear flag after a short delay
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // If dropdown is open, let Select handle the selection naturally
      if (dropdownOpen) {
        return;
      }

      // If we're currently selecting, don't handle Enter here
      if (isSelectingRef.current) {
        e.preventDefault();
        return;
      }

      // Dropdown is closed - use the current input value
      e.preventDefault();
      const currentValue = inputRef.current || value;
      const normalizedValue = useTickers
        ? normalizeBBGTicker(currentValue)
        : currentValue.trim();

      onChange?.(currentValue);
      onSearch?.(normalizedValue);
    }
  };

  const handleSearch = (searchValue: string) => {
    inputRef.current = searchValue || "";
    onChange?.(searchValue || "");
  };

  const filteredOptions = getFilteredOptions(value);

  const placeholder =
    identifierPlaceholder ||
    (useTickers
      ? tickerPlaceholder
      : `Search ${identifierType.toUpperCase()}...`);

  return (
    <Space.Compact style={{ width: "100%", ...style }} className={className}>
      {!useTickers && (
        <Select
          value={identifierType}
          onChange={(newType) => {
            onIdentifierTypeChange?.(newType);
            onChange?.(""); // Clear value when type changes
          }}
          style={{ width: 120 }}
        >
          <Option value="isin">ISIN</Option>
          <Option value="sedol">SEDOL</Option>
        </Select>
      )}
      <AutoComplete
        placeholder={placeholder}
        value={value}
        onChange={handleSearch}
        onSearch={handleSearch}
        onDropdownVisibleChange={(open) => {
          setDropdownOpen(open);
          if (!open) {
            isSelectingRef.current = false;
          }
        }}
        onSelect={(selectedValue, option) => {
          const fullValue = (option as any)?.value || selectedValue || "";
          handleSelect(fullValue);
        }}
        onKeyDown={handleKeyDown}
        filterOption={false} // We handle filtering ourselves
        notFoundContent={
          loadingIdentifiers || loadingTickers ? (
            <div style={{ textAlign: "center", padding: "8px" }}>
              <Spin size="small" />
            </div>
          ) : filteredOptions.length === 0 && value.trim() ? (
            <div style={{ padding: "8px" }}>No matches found</div>
          ) : (
            <div style={{ padding: "8px" }}>
              {value.trim()
                ? "No matches found"
                : useTickers
                  ? "Type to search Tickers"
                  : `Type to search ${identifierType.toUpperCase()}s`}
            </div>
          )
        }
        style={{ flex: 1 }}
        allowClear
        options={filteredOptions.map((option) => ({
          value: option,
          label: option,
        }))}
        {...selectProps}
      />
      {onToggleMode && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 8px",
          }}
        >
          <BodyText type="secondary">ISIN/SEDOL</BodyText>
          <Switch
            checked={useTickers}
            onChange={onToggleMode}
            checkedChildren="Ticker"
            unCheckedChildren="ISIN/SEDOL"
          />
          <BodyText type="secondary">Ticker</BodyText>
        </div>
      )}
    </Space.Compact>
  );
};

IdentifierSearch.displayName = "IdentifierSearch";

