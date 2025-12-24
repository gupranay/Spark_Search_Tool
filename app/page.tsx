"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import InsertServiceProviderDialog from "@/components/InsertProviderDialog";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

const categories = {
  Accountants: "00O38000004gR4OEAU",
  "Augmented Reality/Virtual Reality (AR/VR)": "00O0z000005I1NQEA0",
  Branding: "00O38000004ghWpEAI",
  "Communications Consultants": "00O4z0000064iFkEAI",
  Designers: "00O38000004gR4TEAU",
  "Entrepreneur in Residence (EIR)": "00O38000004spAvEAI",
  "Human Resources (HR)": "00O0z000005TmfdEAC",
  Insurance: "00O4z0000064w8nEAA",
  "Intellectual Property (IP)": "00O38000004gR4JEAU",
  Legal: "00O38000004gR4EEAU",
  Marketing: "00O38000004ghMBEAY",
  Photography: "00O4z0000069k6CEAQ",
  "Public Relations (PR)": "00O0z000005IMFNEA4",
  Software: "00O38000004stl2EAA",
  "User Interface/User Experience (UI/UX)": "00O38000004eUfBEAU",
  Website: "00O38000004ghMuEAI",
  Writers: "00O4z000006OiN5EAK",
};

type RowData = { [key: string]: string };

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [data, setData] = useState<RowData[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set()
  );
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  const handleFetchData = async () => {
    if (!selectedCategory) return;
    const categoryId = categories[selectedCategory as keyof typeof categories];

    try {
      setIsLoading(true);
      const response = await fetch(`/api/fetchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category_id: categoryId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      const extractedData = extractRows(jsonData);
      setData(extractedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractRows = (data: any): RowData[] => {
    const columnsInfo = data.reportExtendedMetadata.detailColumnInfo;
    const columnHeaders = [
      "*",
      ...Object.values(columnsInfo).map((info: any) => info.label),
    ];
    const factMap = data.factMap;
    const extractedData: RowData[] = [];

    for (const key in factMap) {
      if (key === "3!T" || key === "4!T") continue;

      const rows = factMap[key].rows;
      for (const row of rows) {
        const rowData: RowData = {};
        rowData["*"] = key === "2!T" ? "*" : "";

        row.dataCells.forEach((cell: any, i: number) => {
          const columnName = columnHeaders[i + 1];
          let cellValue = cell.label || "";
          if (cellValue.includes("<a href=")) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = cellValue;
            const link = tempDiv.querySelector("a");
            cellValue = link ? link.textContent || "" : "";
          }
          rowData[columnName] = cellValue;
        });
        extractedData.push(rowData);
      }
    }

    return extractedData;
  };

  const toggleRow = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const copyToClipboard = async (text: string, cellId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCell(cellId);
      setTimeout(() => setCopiedCell(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyCell = (
    value: string,
    rowIndex: number,
    columnKey: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const cellId = `${rowIndex}-${columnKey}`;
    copyToClipboard(value, cellId);
  };

  const highlightSearchTerm = (
    text: string,
    searchTerm: string,
    isExpanded: boolean
  ): React.ReactNode => {
    if (!text) return text;

    // Handle truncation first if needed
    let displayText = text;
    if (!isExpanded && text.length > 90) {
      displayText = text.slice(0, 90) + "...";
    }

    // If no search term, return text as-is
    if (!searchTerm) {
      return displayText;
    }

    const searchLower = searchTerm.toLowerCase();
    const displayTextLower = displayText.toLowerCase();
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let currentIndex = 0;
    let keyCounter = 0;

    // Find all matches
    while (
      (currentIndex = displayTextLower.indexOf(searchLower, lastIndex)) !== -1
    ) {
      // Add text before match
      if (currentIndex > lastIndex) {
        parts.push(displayText.slice(lastIndex, currentIndex));
      }
      // Add highlighted match
      parts.push(
        <mark
          key={`highlight-${keyCounter++}`}
          className="bg-yellow-300 text-inherit px-0 py-0"
        >
          {displayText.slice(currentIndex, currentIndex + searchTerm.length)}
        </mark>
      );
      lastIndex = currentIndex + searchTerm.length;
    }

    // Add remaining text
    if (lastIndex < displayText.length) {
      parts.push(displayText.slice(lastIndex));
    }

    // If no matches were found, return the text as-is
    if (parts.length === 0) {
      return displayText;
    }

    return <>{parts}</>;
  };

  const renderCellContent = (content: string, isExpanded: boolean) => {
    return highlightSearchTerm(content, searchValue, isExpanded);
  };

  const filteredData = data
    .filter((row) =>
      Object.values(row).some((value) =>
        value?.toLowerCase().includes(searchValue.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aIsFunder = a["Communication List"]?.includes("Funder List")
        ? 1
        : 0;
      const bIsFunder = b["Communication List"]?.includes("Funder List")
        ? 1
        : 0;

      // Sort by Funder List presence first
      if (aIsFunder !== bIsFunder) {
        return bIsFunder - aIsFunder;
      }

      // Then sort by group ("0!T", "1!T", "2!T", etc.)
      if (a["*"] !== b["*"]) {
        return a["*"].localeCompare(b["*"]);
      }

      // Finally, sort alphabetically by Account Name and Contact Last Name
      const accountNameCompare = a["Account Name"]?.localeCompare(
        b["Account Name"]
      );
      if (accountNameCompare !== 0) {
        return accountNameCompare;
      }

      return a["Contact Last Name"]?.localeCompare(b["Contact Last Name"]);
    });

  const handleDownloadClick = () => {
    if (data.length === 0) return;
    setIsColumnDialogOpen(true);
  };

  const downloadCSV = (columnsToInclude: string[]) => {
    if (data.length === 0 || columnsToInclude.length === 0) return;

    const headers = columnsToInclude;
    const csvRows = data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || "")).join(",")
    );

    const csvData = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `${selectedCategory}_consultant_data.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  const handleDownloadConfirm = () => {
    const columnsArray = Array.from(selectedColumns);
    downloadCSV(columnsArray);
    setIsColumnDialogOpen(false);
  };

  // Initialize selected columns when dialog opens
  useEffect(() => {
    if (isColumnDialogOpen && data.length > 0) {
      const allColumns = Object.keys(data[0]).filter(
        (header) => header !== "Communication List"
      );
      setSelectedColumns(new Set(allColumns));
    }
  }, [isColumnDialogOpen, data]);

  const handleContinue = () => {
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    window.location.replace("https://annarborusa.org/");
  };

  return (
    <div className="container mx-auto p-4">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent style={{ top: "20%" }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Important Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Thank you for using Ann Arbor SPARK&apos;s resource database tool.
              This tool is intended to connect SPARK clients with resources in
              the community. By clicking &quot;Continue,&quot; you agree to hold
              harmless Ann Arbor SPARK from any advice which may not prove
              beneficial in any material way. Grant dollars may be available for
              an engagement with vendors or consultants. For more information on
              how to access potential funding, please contact your SPARK account
              lead. Do not share information found through this tool outside
              your organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="default" onClick={handleContinue}>
                Continue
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Columns to Download</DialogTitle>
            <DialogDescription>
              Choose which columns you want to include in your CSV download.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {data.length > 0 &&
              Object.keys(data[0])
                .filter((header) => header !== "Communication List")
                .map((column) => (
                  <div key={column} className="flex items-center space-x-2">
                    <Checkbox
                      id={column}
                      checked={selectedColumns.has(column)}
                      onCheckedChange={() => handleColumnToggle(column)}
                    />
                    <Label
                      htmlFor={column}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {column}
                    </Label>
                  </div>
                ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsColumnDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownloadConfirm}
              disabled={selectedColumns.size === 0}
            >
              Download CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!isDialogOpen && (
        <>
          <header className="flex justify-start items-center mb-6">
            {/* <img
              src="https://annarborusa.org/wp-content/uploads/2022/08/spark-logo.svg"
              alt="Spark Logo"
              className="w-32 h-auto"
            /> */}
          </header>

          <main>
            {/* <h1 className="text-2xl font-bold mb-4">
              Pull Consultant Data from Salesforce
            </h1> */}

            <Select
              onValueChange={setSelectedCategory}
              value={selectedCategory}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a category of consultants" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(categories).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-between items-center mt-4">
              <Button
                type="button"
                onClick={handleFetchData}
                disabled={isLoading}
              >
                {isLoading ? "Pulling Data..." : "Pull Data"}
              </Button>

              <div className="ml-4">
                <Button
                  type="button"
                  onClick={handleDownloadClick}
                  disabled={isLoading || data.length === 0}
                >
                  Download CSV
                </Button>
              </div>
              {/* <InsertServiceProviderDialog
                onServiceProviderAdded={handleFetchData}
              /> */}
            </div>

            <Input
              type="text"
              placeholder="Enter search value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="mt-4"
            />
            <p className="mt-4 text-sm text-gray-600">
              <strong>Note:</strong> Records that are marked with * indicate a
              consultant that is new to SPARK&rsquo;s resource database.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Tip:</strong> Click on any cell to copy its value.
            </p>
            {isLoading ? (
              <div className="flex justify-center mt-4">
                <LoadingSpinner size={48} />
              </div>
            ) : (
              filteredData.length > 0 && (
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 sticky left-0 z-10 bg-background border-r"></TableHead>
                        {Object.keys(filteredData[0])
                          .filter((header) => header !== "Communication List") // Skip rendering "Communication List" header
                          .map((header) => (
                            <TableHead key={header}>{header}</TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((row, index) => {
                        const isExpanded = expandedRows.includes(index);
                        const cellId = (rowIndex: number, colKey: string) =>
                          `${rowIndex}-${colKey}`;

                        return (
                          <TableRow
                            key={index}
                            className={`${
                              isExpanded ? "expanded-row" : "collapsed-row"
                            }`}
                          >
                            <TableCell className="w-12 p-2 sticky left-0 z-10 bg-background border-r">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => toggleRow(index, e)}
                                className="h-8 w-8 p-0"
                                title={
                                  isExpanded ? "Collapse row" : "Expand row"
                                }
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            {Object.entries(row)
                              .filter(([key]) => key !== "Communication List") // Skip rendering "Communication List" data
                              .map(([key, value], i) => {
                                const currentCellId = cellId(index, key);
                                const isCellCopied =
                                  copiedCell === currentCellId;

                                return (
                                  <TableCell
                                    key={i}
                                    className="table-cell relative group"
                                    onClick={(e) =>
                                      copyCell(value, index, key, e)
                                    }
                                    title="Click to copy"
                                  >
                                    <div className="flex items-center justify-between gap-2 min-h-[24px]">
                                      <span className="flex-1">
                                        {renderCellContent(value, isExpanded)}
                                      </span>
                                      {isCellCopied ? (
                                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                      ) : (
                                        <Copy className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                      )}
                                    </div>
                                  </TableCell>
                                );
                              })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default Home;
