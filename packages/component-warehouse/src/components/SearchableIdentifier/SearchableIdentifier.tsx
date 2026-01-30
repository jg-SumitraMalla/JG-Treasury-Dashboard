import * as React from "react";
import { AutoComplete, Space, Spin, Switch, Select } from "antd";
import type { AutoCompleteProps } from "antd";
import { BodyText } from "../Typography";

const { Option } = Select;

export interface SearchResult {
  /** ISIN code (if available) */
  isin?: string;
  /** SEDOL code (if available) */
  sedol?: string;
  /** Bloomberg ticker (if available) */
  bbg_ticker?: string;
}

export interface SearchableIdentifierProps {
  /** Current search value */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when a value is selected (clicked or Enter pressed) */
  onSelect?: (value: string, result?: SearchResult) => void;
  /** Whether to use tickers mode (true) or ISIN/SEDOL mode (false) */
  useTickers?: boolean;
  /** Callback when ticker/ISIN toggle changes */
  onToggleMode?: (useTickers: boolean) => void;
  /** Current identifier type (when not using tickers) */
  identifierType?: "isin" | "sedol";
  /** Callback when identifier type changes */
  onIdentifierTypeChange?: (type: "isin" | "sedol") => void;
  /** Function to perform the search - should return SearchResult[] */
  onSearch: (query: string, type: "isin" | "sedol" | "bbg_ticker", signal?: AbortSignal) => Promise<SearchResult[]>;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** Minimum characters before searching (default: 2) */
  minSearchLength?: number;
  /** Placeholder text for ticker mode */
  tickerPlaceholder?: string;
  /** Placeholder text for ISIN/SEDOL mode */
  identifierPlaceholder?: string;
  /** Additional props to pass to the AutoComplete component */
  autoCompleteProps?: Omit<
    AutoCompleteProps,
    | "value"
    | "onChange"
    | "onSearch"
    | "options"
    | "placeholder"
    | "onSelect"
    | "onKeyDown"
    | "filterOption"
  >;
  /** Style for the container */
  style?: React.CSSProperties;
  /** Class name for the container */
  className?: string;
  /** Loading state */
  loading?: boolean;
}

/**
 * Normalize Bloomberg ticker by appending "2" if needed
 * Pattern: tickers ending with space + single letter (e.g., "002371 C") should become "002371 C2"
 */
const normalizeBBGTicker = (ticker: string): string => {
  const match = ticker.match(/^(.+)\s([A-Z])$/);
  if (match) {
    const [, prefix, letter] = match;
    return `${prefix} ${letter}2`;
  }
  return ticker;
};

export interface SearchableIdentifierRef {
  cancelSearch: () => void;
}

export const SearchableIdentifier = React.forwardRef<SearchableIdentifierRef, SearchableIdentifierProps>(({
  value = "",
  onChange,
  onSelect,
  useTickers = true,
  onToggleMode,
  identifierType = "isin",
  onIdentifierTypeChange,
  onSearch,
  debounceMs = 300,
  minSearchLength = 2,
  tickerPlaceholder = "Search Ticker...",
  identifierPlaceholder,
  autoCompleteProps,
  style,
  className,
  loading = false,
}, ref) => {
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = React.useRef<boolean>(false);
  const inputRef = React.useRef<string>("");
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Expose cancel method via ref
  React.useImperativeHandle(ref, () => ({
    cancelSearch: () => {
      // Cancel any pending search
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      setIsSearching(false);
    },
  }), []);

  // Clear debounce timer and abort controller on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Perform search with debouncing
  const performSearch = React.useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minSearchLength) {
        setSearchResults([]);
        setDropdownOpen(false);
        return;
      }

      // Cancel previous search request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this search
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsSearching(true);
      try {
        const searchType = useTickers ? "bbg_ticker" : identifierType;
        console.log("Searching with type:", searchType, "useTickers:", useTickers, "identifierType:", identifierType);
        const results = await onSearch(searchQuery, searchType, abortController.signal);
        
        // Check if request was aborted
        if (abortController.signal.aborted) {
          return;
        }
        
        setSearchResults(results);
        // Open dropdown if we have results
        if (results && results.length > 0) {
          setDropdownOpen(true);
        } else {
          setDropdownOpen(false);
        }
      } catch (error: any) {
        // Ignore abort errors
        if (error?.name === "AbortError" || error?.message?.includes("cancelled") || error?.message?.includes("aborted")) {
          console.log("Search request was cancelled");
          return;
        }
        console.error("Search error:", error);
        setSearchResults([]);
        setDropdownOpen(false);
      } finally {
        // Only update loading state if this request wasn't aborted
        if (!abortController.signal.aborted) {
          setIsSearching(false);
        }
      }
    },
    [useTickers, identifierType, onSearch, minSearchLength],
  );

  // Debounced search handler
  const handleSearch = React.useCallback(
    (searchValue: string) => {
      inputRef.current = searchValue || "";
      onChange?.(searchValue || "");

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // If search value is too short, clear results and close dropdown
      if (!searchValue || searchValue.length < minSearchLength) {
        setSearchResults([]);
        setDropdownOpen(false);
        return;
      }

      // Set new timer for debounced search
      debounceTimerRef.current = setTimeout(() => {
        performSearch(searchValue);
      }, debounceMs);
    },
    [onChange, performSearch, debounceMs, minSearchLength],
  );

  // Handle selection from dropdown
  const handleSelect = React.useCallback(
    (selectedValue: string, option?: any) => {
      const fullValue = option?.value || selectedValue || "";
      const result = searchResults.find(
        (r) =>
          (useTickers && r.bbg_ticker === fullValue) ||
          (!useTickers &&
            identifierType === "isin" &&
            r.isin === fullValue) ||
          (!useTickers &&
            identifierType === "sedol" &&
            r.sedol === fullValue),
      );

      // Normalize ticker if needed
      const normalizedValue = useTickers
        ? normalizeBBGTicker(fullValue)
        : fullValue.trim();

      onChange?.(fullValue);
      inputRef.current = fullValue;
      isSelectingRef.current = true;
      setDropdownOpen(false);

      // Trigger onSelect callback
      onSelect?.(normalizedValue, result);

      // Clear flag after a short delay
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 100);
    },
    [onChange, onSelect, useTickers, identifierType, searchResults],
  );

  // Handle Enter key
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        // If we're currently selecting (onSelect just fired), don't handle Enter here
        if (isSelectingRef.current) {
          e.preventDefault();
          return;
        }

        // Get the current input value directly from the input element
        const inputElement = e.target as HTMLInputElement;
        const currentValue = inputElement?.value || inputRef.current || value;
        
        if (currentValue && currentValue.trim()) {
          // If dropdown is open and there are results, AutoComplete will handle selection
          // But we also want to support typing and pressing Enter, so we'll handle it here too
          // The isSelectingRef flag will prevent double-triggering
          e.preventDefault();
          
          // Normalize the value based on type
          const normalizedValue = useTickers
            ? normalizeBBGTicker(currentValue.trim())
            : currentValue.trim();
          
          // Update the input value
          onChange?.(currentValue.trim());
          inputRef.current = currentValue.trim();
          
          // Close dropdown
          setDropdownOpen(false);
          
          // Mark that we're selecting to prevent double-triggering
          isSelectingRef.current = true;
          
          // Trigger search with the typed/selected value
          onSelect?.(normalizedValue);
          
          // Clear flag after a short delay
          setTimeout(() => {
            isSelectingRef.current = false;
          }, 100);
        }
      }
    },
    [value, onChange, onSelect, useTickers],
  );

  // Get display value for options
  const getDisplayValue = (result: SearchResult): string => {
    if (useTickers && result.bbg_ticker) {
      return result.bbg_ticker;
    }
    if (!useTickers && identifierType === "isin" && result.isin) {
      return result.isin;
    }
    if (!useTickers && identifierType === "sedol" && result.sedol) {
      return result.sedol;
    }
    return "";
  };

  // Get the actual value for options
  const getOptionValue = (result: SearchResult): string => {
    if (useTickers && result.bbg_ticker) {
      return result.bbg_ticker;
    }
    if (!useTickers && identifierType === "isin" && result.isin) {
      return result.isin;
    }
    if (!useTickers && identifierType === "sedol" && result.sedol) {
      return result.sedol;
    }
    return "";
  };

  const placeholder =
    identifierPlaceholder ||
    (useTickers
      ? tickerPlaceholder
      : `Search ${identifierType.toUpperCase()}...`);

  const options = searchResults
    .map((result) => {
      const displayValue = getDisplayValue(result);
      const optionValue = getOptionValue(result);
      if (!displayValue || !optionValue) return null;
      return {
        value: optionValue,
        label: displayValue,
        result,
      };
    })
    .filter((opt): opt is { value: string; label: string; result: SearchResult } => opt !== null);

  return (
    <Space.Compact style={{ width: "100%", ...style }} className={className}>
      {!useTickers && (
        <Select
          value={identifierType}
          onChange={(newType) => {
            onIdentifierTypeChange?.(newType);
            onChange?.(""); // Clear value when type changes
            setSearchResults([]);
            setDropdownOpen(false);
            // Clear any pending debounce timers
            if (debounceTimerRef.current) {
              clearTimeout(debounceTimerRef.current);
              debounceTimerRef.current = null;
            }
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
        open={dropdownOpen}
        onDropdownVisibleChange={(open) => {
          setDropdownOpen(open);
          if (!open) {
            isSelectingRef.current = false;
          }
        }}
        onSelect={(selectedValue, option) => {
          // When user selects from dropdown, handle the selection
          const result = (option as any)?.result;
          handleSelect(selectedValue, { ...option, result });
        }}
        onKeyDown={handleKeyDown}
        filterOption={false} // We handle filtering via API
        notFoundContent={
          isSearching || loading ? (
            <div style={{ textAlign: "center", padding: "8px" }}>
              <Spin size="small" />
            </div>
          ) : options.length === 0 && value.trim() ? (
            <div style={{ padding: "8px" }}>No matches found</div>
          ) : (
            <div style={{ padding: "8px" }}>
              {value.trim()
                ? "No matches found"
                : useTickers
                  ? `Type at least ${minSearchLength} characters to search Tickers`
                  : `Type at least ${minSearchLength} characters to search ${identifierType.toUpperCase()}s`}
            </div>
          )
        }
        style={{ flex: 1 }}
        allowClear
        options={options}
        {...autoCompleteProps}
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
            onChange={(checked) => {
              // Clear any pending debounce timers
              if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = null;
              }
              setSearchResults([]);
              setDropdownOpen(false);
              onToggleMode(checked);
            }}
            checkedChildren="Ticker"
            unCheckedChildren="ISIN/SEDOL"
          />
          <BodyText type="secondary">Ticker</BodyText>
        </div>
      )}
    </Space.Compact>
  );
});

SearchableIdentifier.displayName = "SearchableIdentifier";

