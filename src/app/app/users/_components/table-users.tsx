"use client";

"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchApi } from "@/services/fetchApi";
import { useState, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function TableUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const [page, setPage] = useState(1);

  const itemsPerPage = 2;

  const [loadingUsers, setSetLoadingUsers] = useState(true);

  async function getUsers() {
    setSetLoadingUsers(true);
    const fetchUsersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`
    );

    fetchUsersUrl.searchParams.set("page", String(page));
    fetchUsersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchUsersUrl.pathname}${fetchUsersUrl.search}`
    );

    if (!response.ok) {
      setSetLoadingUsers(false);
      return;
    }

    const data = await response.json();

    setUsers(data);
    setSetLoadingUsers(false);
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    getUsers();
  }, [page]);

  const rolesBadges = {
    USER: "bg-violet-500 hover:bg-violet-700",
    ADMIN: "bg-yellow-500 hover:bg-yellow-700",
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableCaption>A list of all users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>

              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users &&
              users.map((user) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.id.substring(0, 10)}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {user.name}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {user.email}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      <Badge
                        className={`${
                          user.role === "ADMIN"
                            ? rolesBadges.ADMIN
                            : rolesBadges.USER
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href={`/app/users/${user.id}`}>Ver usuário</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <div className="w-full flex gap-2 items-center justify-end">
          <Button
            className="disabled:cursor-not-allowed"
            disabled={page === 1}
            onClick={previousPage}
          >
            Previous
          </Button>
          <Button
            className="disabled:cursor-not-allowed"
            disabled={users.length < itemsPerPage}
            onClick={nextPage}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
