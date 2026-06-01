import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function AdminTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  emptyMessage = "No data available",
}: AdminTableProps<T>) {
  return (
    <div className="rounded-xl border border-[#b7e4c7] bg-white/50 backdrop-blur-sm overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-emerald-50/50 border-[#b7e4c7] bg-emerald-50/30">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`text-[#1b4332] font-bold uppercase text-xs tracking-wider ${column.className || ""}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-[#40916c] py-12 font-medium"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={index}
                onClick={() => onRowClick?.(item)}
                className={`hover:bg-[#d8f3dc] border-[#d8f3dc] transition-all duration-200 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={`text-[#1b4332] font-medium ${column.className || ""}`}
                  >
                    {column.render
                      ? column.render(item)
                      : (item[column.key] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}


