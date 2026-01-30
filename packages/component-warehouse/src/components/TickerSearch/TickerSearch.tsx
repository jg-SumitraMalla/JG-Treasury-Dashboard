import * as React from "react";
import { AutoComplete, Space, Switch, Select, Spin } from "antd";
import type { AutoCompleteProps } from "antd";
import { BodyText } from "../Typography";

const { Option } = Select;

export interface TickerSearchResult {
  /** ISIN code (if available) */
  isin?: string;
  /** SEDOL code (if available) */
  sedol?: string;
  /** Bloomberg ticker (if available) */
  bbg_ticker?: string;
}

export interface TickerSearchProps {
  /** Current search value */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when a value is selected */
  onSelect?: (value: string, result?: TickerSearchResult) => void;
  /** Whether to use tickers mode (true) or ISIN/SEDOL mode (false) */
  useTickers?: boolean;
  /** Callback when ticker/ISIN toggle changes */
  onToggleMode?: (useTickers: boolean) => void;
  /** Current identifier type (when not using tickers) */
  identifierType?: "isin" | "sedol";
  /** Callback when identifier type changes */
  onIdentifierTypeChange?: (type: "isin" | "sedol") => void;
  /** Function to perform the search - should return TickerSearchResult[] */
  onSearch: (query: string, type: "isin" | "sedol" | "bbg_ticker", signal?: AbortSignal) => Promise<TickerSearchResult[]>;
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
  >;
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
  const trimmed = ticker.trim();
  // Match pattern: ends with space + single letter
  const match = trimmed.match(/^(.+)\s([A-Z])$/);
  if (match) {
    return `${match[1]} ${match[2]}2`;
  }
  return trimmed;
};

export const TickerSearch: React.FC<TickerSearchProps> = ({
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
}) => {
  const [searchResults, setSearchResults] = React.useState<TickerSearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const autoCompleteRef = React.useRef<any>(null);
  const enterKeyHandledRef = React.useRef<boolean>(false);

  // Cleanup on unmount
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
        setOpen(false);
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
        const results = await onSearch(searchQuery, searchType, abortController.signal);
        
        // Check if request was aborted
        if (abortController.signal.aborted) {
          return;
        }
        
        setSearchResults(results);
        // Open dropdown if we have results
        if (results && results.length > 0) {
          setOpen(true);
        } else {
          setOpen(false);
        }
      } catch (error: any) {
        // Ignore abort errors
        if (error?.name === "AbortError" || error?.message?.includes("cancelled") || error?.message?.includes("aborted")) {
          return;
        }
        console.error("Search error:", error);
        setSearchResults([]);
        setOpen(false);
      } finally {
        // Only update loading state if this request wasn't aborted
        if (!abortController.signal.aborted) {
          setIsSearching(false);
        }
      }
    },
    [useTickers, identifierType, onSearch, minSearchLength],
  );

  // Handle search input with debouncing
  const handleSearch = React.useCallback(
    (searchValue: string) => {
      onChange?.(searchValue);
      
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        performSearch(searchValue);
      }, debounceMs);
    },
    [onChange, performSearch, debounceMs],
  );

  // Handle selection from dropdown
  const handleSelect = React.useCallback(
    (selectedValue: string, option: any) => {
      enterKeyHandledRef.current = true;
      const result = option?.result as TickerSearchResult | undefined;
      const displayValue = result?.bbg_ticker || result?.isin || result?.sedol || selectedValue;
      
      // Normalize if it's a ticker
      const normalizedValue = useTickers && result?.bbg_ticker
        ? normalizeBBGTicker(displayValue)
        : displayValue;
      
      onChange?.(displayValue);
      onSelect?.(normalizedValue, result);
      setOpen(false);
      setActiveOptionIndex(-1);
      
      // Reset flag after a short delay
      setTimeout(() => {
        enterKeyHandledRef.current = false;
      }, 100);
    },
    [onChange, onSelect, useTickers],
  );

  // Get display value for options
  const getDisplayValue = React.useCallback((result: TickerSearchResult): string => {
    if (result.bbg_ticker) return result.bbg_ticker;
    if (result.isin) return result.isin;
    if (result.sedol) return result.sedol;
    return "";
  }, []);

  // Track active option index for arrow key navigation
  const [activeOptionIndex, setActiveOptionIndex] = React.useState<number>(-1);

  // Reset active index when search results change
  React.useEffect(() => {
    setActiveOptionIndex(-1);
  }, [searchResults]);

  // Handle Enter key - select highlighted option if available
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        // Reset the flag
        enterKeyHandledRef.current = false;
        
        // If dropdown is open and we have results, try to select highlighted option
        if (open && searchResults.length > 0) {
          // Try to find the highlighted option in the DOM immediately
          const dropdown = document.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
          
          if (dropdown) {
            const highlightedOption = dropdown.querySelector('.ant-select-item-option-active');
            
            if (highlightedOption) {
              // Get the value from the highlighted option
              const optionValue = highlightedOption.getAttribute('title') || 
                                 highlightedOption.textContent?.trim() || '';
              
              if (optionValue) {
                // Find the matching result
                const result = searchResults.find(r => {
                  const displayValue = getDisplayValue(r);
                  return displayValue === optionValue;
                });
                
                if (result) {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  const displayValue = getDisplayValue(result);
                  const normalizedValue = useTickers && result.bbg_ticker
                    ? normalizeBBGTicker(displayValue)
                    : displayValue;
                  
                  onChange?.(displayValue);
                  onSelect?.(normalizedValue, result);
                  setOpen(false);
                  setActiveOptionIndex(-1);
                  enterKeyHandledRef.current = true;
                  return;
                }
              }
            }
            
            // If we have an active index tracked, use that
            if (activeOptionIndex >= 0 && activeOptionIndex < searchResults.length) {
              e.preventDefault();
              e.stopPropagation();
              
              const result = searchResults[activeOptionIndex];
              const displayValue = getDisplayValue(result);
              const normalizedValue = useTickers && result.bbg_ticker
                ? normalizeBBGTicker(displayValue)
                : displayValue;
              
              onChange?.(displayValue);
              onSelect?.(normalizedValue, result);
              setOpen(false);
              setActiveOptionIndex(-1);
              enterKeyHandledRef.current = true;
              return;
            }
          }
          
          // If no highlighted option found, wait a bit to see if onSelect fires
          // If it doesn't, use the typed value
          setTimeout(() => {
            if (!enterKeyHandledRef.current) {
              const currentValue = (e.target as HTMLInputElement).value || value;
              if (currentValue && currentValue.trim()) {
                const normalizedValue = useTickers
                  ? normalizeBBGTicker(currentValue.trim())
                  : currentValue.trim();
                
                onChange?.(currentValue.trim());
                onSelect?.(normalizedValue);
                setOpen(false);
              }
            }
          }, 50);
        } else {
          // Dropdown is closed, use the current input value
          const currentValue = (e.target as HTMLInputElement).value || value;
          if (currentValue && currentValue.trim()) {
            const normalizedValue = useTickers
              ? normalizeBBGTicker(currentValue.trim())
              : currentValue.trim();
            
            onChange?.(currentValue.trim());
            onSelect?.(normalizedValue);
          }
        }
      } else if (e.key === "ArrowDown") {
        // Track arrow down navigation
        if (open && searchResults.length > 0) {
          const nextIndex = activeOptionIndex < searchResults.length - 1 
            ? activeOptionIndex + 1 
            : 0;
          setActiveOptionIndex(nextIndex);
        }
      } else if (e.key === "ArrowUp") {
        // Track arrow up navigation
        if (open && searchResults.length > 0) {
          const prevIndex = activeOptionIndex > 0 
            ? activeOptionIndex - 1 
            : searchResults.length - 1;
          setActiveOptionIndex(prevIndex);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        setActiveOptionIndex(-1);
      }
    },
    [value, onChange, onSelect, useTickers, open, searchResults, activeOptionIndex, getDisplayValue],
  );

  // Convert search results to AutoComplete options
  const options = React.useMemo(() => {
    return searchResults.map((result) => {
      const displayValue = getDisplayValue(result);
      return {
        value: displayValue,
        label: displayValue,
        result: result,
      };
    });
  }, [searchResults]);

  const placeholder =
    identifierPlaceholder ||
    (useTickers
      ? tickerPlaceholder
      : `Search ${identifierType.toUpperCase()}...`);

    return (
    <Space.Compact style={{ width: "100%", ...style }} className={className}>
      {!useTickers && onIdentifierTypeChange && (
        <Select
          value={identifierType}
          onChange={onIdentifierTypeChange}
          style={{ width: 140 }}
        >
          <Option value="isin">ISIN</Option>
          <Option value="sedol">SEDOL</Option>
        </Select>
      )}
      <div style={{ position: "relative", flex: 1, minWidth: 0, width: 0 }}>
        {isSearching && (
          <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", zIndex: 1, pointerEvents: "none" }}>
            <Spin size="small" />
          </div>
        )}
        <AutoComplete
          ref={autoCompleteRef}
          value={value}
          onChange={handleSearch}
          onSelect={handleSelect}
          onKeyDown={handleKeyDown}
          options={options}
          placeholder={placeholder}
          open={open}
          onDropdownVisibleChange={setOpen}
          filterOption={false} // We handle filtering via API
          notFoundContent={isSearching ? "Searching..." : "No results found"}
          style={{ flex: 1, width: "100%" }}
          {...autoCompleteProps}
        />
      </div>
      {onToggleMode && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 8px" }}>
          <Switch
            checked={useTickers}
            onChange={(checked) => {
              setSearchResults([]);
              setOpen(false);
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
};
