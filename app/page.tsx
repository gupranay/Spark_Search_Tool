"use client";
import { useState } from "react";
import Head from "next/head";
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
import InsertServiceProviderDialog from "@/components/InsertProviderDialog";

const categories = {
  Branding: "00O38000004ghWpEAI",
  Designers: "00O38000004gR4TEAU",
  Website: "00O38000004ghMuEAI",
  "User Interface/User Experience (UI/UX)": "00O38000004eUfBEAU",
  Marketing: "00O38000004ghMBEAY",
  Accountants: "00O38000004gR4OEAU",
  "Augmented Reality/Virtual Reality (AR/VR)": "00O0z000005I1NQEA0",
  "Public Relations (PR)": "00O0z000005IMFNEA4",
  Legal: "00O38000004gR4EEAU",
  Software: "00O38000004stl2EAA",
  "Human Resources (HR)": "00O0z000005TmfdEAC",
  "Communications Consultants": "00O4z0000064iFkEAI",
  "Entrepreneur in Residence (EIR)": "00O38000004spAvEAI",
  Insurance: "00O4z0000064w8nEAA",
  Photography: "00O4z0000069k6CEAQ",
  "Intellectual Property (IP)": "00O38000004gR4JEAU",
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

  const handleFetchData = async () => {
    if (!selectedCategory) return;
    const categoryId = categories[selectedCategory as keyof typeof categories];

    try {
      setIsLoading(true);
      const response = await fetch(`/api/fetchData?category_id=${categoryId}`);
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
          const columnName = columnHeaders[i + 1]; // Skip the first column (*)
          let cellValue = cell.label || "";
          if (cellValue.includes("<a href=")) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = cellValue;
            const link = tempDiv.querySelector("a");
            cellValue = link ? link.textContent || "" : "";
          }
          rowData[columnName] = cellValue;
        });
        // //hyperlink website column
        // if (rowData["Website"]) {
        //   rowData["Website"] = `<a href="${rowData["Website"]}" target="_blank">${rowData["Website"]}</a>`;
        // }
        extractedData.push(rowData);
      }
    }

    return extractedData;
  };

  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const renderCellContent = (content: string, isExpanded: boolean) => {
    if (content.length <= 90) return content;
    if (isExpanded) return content;
    return `${content.slice(0, 90)}...`;
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value?.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const downloadCSV = () => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
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

  const handleContinue = () => {
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    window.location.replace("https://annarborusa.org/");
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Spark Consultant Data</title>
        <link rel="icon" href="/public/spark_logo.png" />
        <meta property="og:title" content="Spark Consultant Data" />
        <meta
          property="og:description"
          content="Pull Consultant Data from Salesforce"
        />
        <meta property="og:image" content="/spark_logo.png" />
        <meta
          property="og:url"
          content="https://spark-search-tool.vercel.app/"
        />
        <meta name="robots" content="noindex" />
      </Head>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Important Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Thank you for using Ann Arbor SPARK&apos;s resource database tool.
              This tool is intended to connect SPARK clients with resources in
              the community. By clicking &quot;Continue&quot;, you acknowledge
              that SPARK holds no liability for any outcomes. Funding may be
              available for an engagement with vendors or consultants. For more
              information on how to access potential funding, please be in touch
              with your account lead or email. Do not share information found
              through this tool outside your organization.
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

      {!isDialogOpen && (
        <>
          <header className="flex justify-start items-center mb-6">
            <img
              src="https://annarborusa.org/wp-content/uploads/2022/08/spark-logo.svg"
              alt="Spark Logo"
              className="w-32 h-auto"
            />
          </header>

          <main>
            <h1 className="text-2xl font-bold mb-4">
              Pull Consultant Data from Salesforce
            </h1>

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
                  onClick={downloadCSV}
                  disabled={isLoading || data.length === 0}
                >
                  Download CSV
                </Button>
              </div>
              <InsertServiceProviderDialog onServiceProviderAdded={handleFetchData} />
            </div>

            <Input
              type="text"
              placeholder="Enter search value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="mt-4"
            />
            <p className="mt-4 text-sm text-gray-600">
              <strong>Note:</strong> Records that are marked with
              &ldquo;*&rdquo; indicate a consultant that is new to SPARK&rsquo;s
              resource database.
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
                        {Object.keys(filteredData[0]).map((header) => (
                          <TableHead key={header}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((row, index) => (
                        <TableRow
                          key={index}
                          onClick={() => toggleRow(index)}
                          className={`cursor-pointer ${
                            expandedRows.includes(index)
                              ? "expanded-row"
                              : "collapsed-row"
                          }`}
                        >
                          {Object.values(row).map((value, i) => (
                            <TableCell key={i} className="table-cell">
                              {renderCellContent(
                                value,
                                expandedRows.includes(index)
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
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
