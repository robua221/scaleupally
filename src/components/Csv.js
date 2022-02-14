import {
  Heading,
  Button,
  Stack,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  FormControl,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useCSVReader } from "react-papaparse";
import { useTable, useSortBy } from "react-table";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },

  file: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "100%",
  },
  remove: {
    borderRadius: 0,
    padding: "0 20px",
  },
  progressBarBackgroundColor: {
    backgroundColor: "red",
  },
};
const Csv = () => {
  const submithandler = (e) => {
    e.preventDefault();
  }
  const [columnData, setColumnData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const columns = useMemo(() => columnData, [columnData]);
  const data = useMemo(() => rowData, [rowData]);
  const tableInstance = useTable({ columns, data }, useSortBy);
  const { CSVReader } = useCSVReader();
  const { getTableBodyProps, getTableProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const onUploadAccepted = (result) => {
    console.log(result);
    const columns = result.data[0].map((col, index) => {
      return {
        Header: col,
        accessor: col.split(" ").join("_").toLowerCase(),
      };
    });

    const rows = result.data.slice(1).map((row) => {
      return row.reduce((obj, col, index) => {
        obj[columns[index].accessor] = col;
        return obj;
      }, {});
    });
    setRowData(rows);
    setColumnData(columns);
  };
  return (
    <>
      <Heading>CSV READER</Heading>
      <CSVReader onUploadAccepted={onUploadAccepted}>
        {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
          <>
            <div style={styles.csvReader}>
              <Stack direction={["column", "row"]} spacing="24px" margin="10">
                <Box>
                  <Button
                    type="button"
                    {...getRootProps()}
                    style={styles.browseFile}
                  >
                    Browse file
                  </Button>
                </Box>
                <Box width="80%" border="2px solid #ccc">
                  {acceptedFile && acceptedFile.name}
                </Box>

                <Button {...getRemoveFileProps()} style={styles.remove}>
                  Remove
                </Button>
              </Stack>

              <div style={styles.acceptedFile}></div>
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
      <FormControl onSubmit={submithandler}>
        <Table {...getTableBodyProps()} variant="striped" colorScheme="teal">
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()}>
                    {column.render("Header")}

                    {}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  ))}
                </Tr>
              );
            })}
            <Tr>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>
      </FormControl>
    </>
  );
};

export default Csv;