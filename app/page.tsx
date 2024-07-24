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

const categories = {
  Branding: "00O38000004ghWpEAI",
  Designers: "00O38000004gR4TEAU",
  Website: "00O38000004ghMuEAI",
  "UI/UX": "00O38000004eUfBEAU",
  Marketing: "00O38000004ghMBEAY",
  Accountants: "00O38000004gR4OEAU",
  "AR/VR": "00O0z000005I1NQEA0",
  PR: "00O0z000005IMFNEA4",
  Legal: "00O38000004gR4EEAU",
  Software: "00O38000004stl2EAA",
  HR: "00O0z000005TmfdEAC",
  "PR/Communications Consultants": "00O4z0000064iFkEAI",
  EIR: "00O38000004spAvEAI",
  Insurance: "00O4z0000064w8nEAA",
  Photography: "00O4z0000069k6CEAQ",
  IP: "00O38000004gR4JEAU",
  "BootCamp Mentors": "00O4z000005mO0oEAE",
  Writers: "00O4z000006OiN5EAK",
};

type RowData = { [key: string]: string };

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [data, setData] = useState<RowData[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        extractedData.push(rowData);
      }
    }

    return extractedData;
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
        <meta property="og:url" content="http://localhost:3000/" />
      </Head>

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

        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
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

        <Button
          type="button"
          onClick={handleFetchData}
          disabled={isLoading}
          className="mt-4"
        >
          {isLoading ? "Pulling Data..." : "Pull Data"}
        </Button>

        <Input
          type="text"
          placeholder="Enter search value"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="mt-4"
        />
        <p className="mt-4 text-sm text-gray-600">
          <strong>Note:</strong> Rows marked with * indicate that the vendor is
          not an established vendor with Spark and Spark holds no
          responsibility.
        </p>
        {isLoading ? (
          <div className="flex justify-center mt-4">
            <LoadingSpinner size={48} />
          </div>
        ) : (
          data.length > 0 && (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(data[0]).map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data
                    .filter((row) =>
                      Object.values(row).some((value) =>
                        String(value)
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                    )
                    .map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, i) => (
                          <TableCell key={i}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default Home;
