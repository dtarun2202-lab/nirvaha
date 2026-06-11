import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { ActionMenu } from "@/admin/components/ActionMenu";
import { ConfirmModal } from "@/admin/components/ConfirmModal";
import BACKEND_CONFIG from "@/config/backend";
import learningPathsData from "@/data/learningPaths.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, GraduationCap } from "lucide-react";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "companion" | "admin";
  status: "active" | "suspended" | "banned" | "pending";
  joinDate: string;
  lastActive: string;
  enrolledCourses?: Array<{ courseId: string; enrolledAt: string }>;
}

export function UserManagementPage() {
  const [filter, setFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "suspend" | "unsuspend";
    user: PlatformUser;
  } | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleDraft, setRoleDraft] = useState<PlatformUser["role"]>("user");
  const [roleTarget, setRoleTarget] = useState<PlatformUser | null>(null);

  const apiBaseUrl = BACKEND_CONFIG.API_BASE_URL;

  // Map course IDs to titles
  const courseMap = useMemo(() => {
    const map: Record<string, string> = {};
    learningPathsData.learningPaths.forEach((path: any) => {
      map[path.id] = path.title;
    });
    return map;
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/users?limit=1000`);
      if (response.ok) {
        const data = await response.json();
        const mapped: PlatformUser[] = data.map((u: any) => ({
          id: u.id || u._id,
          name: u.name,
          email: u.email,
          role: u.role || "user",
          status: u.status || "active",
          joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A",
          lastActive: u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : "N/A",
          enrolledCourses: u.enrolledCourses || [],
        }));
        setUsers(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesFilter = filter === "all" || user.status === filter;
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesSearch =
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesRole && matchesSearch;
      }),
    [users, filter, roleFilter, searchQuery]
  );

  const handleView = (user: PlatformUser) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleAction = (type: string, user: PlatformUser) => {
    if (type === "change-role") {
      setRoleTarget(user);
      setRoleDraft(user.role);
      setRoleModalOpen(true);
    } else {
      const actionType: "suspend" | "unsuspend" =
        user.status === "suspended" ? "unsuspend" : "suspend";
      setConfirmAction({ type: actionType, user });
    }
  };

  const confirmActionHandler = async () => {
    if (!confirmAction) return;
    const newStatus = confirmAction.type === "suspend" ? "suspended" : "active";
    try {
      const res = await fetch(`${apiBaseUrl}/api/users/${confirmAction.user.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === confirmAction.user.id ? { ...u, status: newStatus } : u
          )
        );
      } else {
        console.error("Failed to update status on server");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setConfirmAction(null);
    }
  };

  const handleRoleSave = async () => {
    if (!roleTarget) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/users/${roleTarget.id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleDraft }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === roleTarget.id ? { ...u, role: roleDraft } : u))
        );
      } else {
        console.error("Failed to update role on server");
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setRoleModalOpen(false);
      setRoleTarget(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const configs = {
      admin: { label: "Admin", className: "bg-purple-100 text-purple-800 border-purple-300" },
      companion: { label: "Companion", className: "bg-teal-100 text-teal-800 border-teal-300" },
      user: { label: "User", className: "bg-blue-100 text-blue-800 border-blue-300" },
    };
    const config = configs[role as keyof typeof configs] || configs.user;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-6 bg-[#F4FAF6] min-h-screen -m-6 rounded-tl-3xl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F4131] mb-2">User Management</h1>
            <p className="text-[#64C08E] font-medium">Monitor and manage user accounts and roles</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white border-[#D5EEDD] p-6 rounded-3xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#86CDA6]" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white border-[#BDE8CE] text-black placeholder:text-[#86CDA6] rounded-xl h-12 focus-visible:ring-[#5ABF88] font-medium transition-all hover:bg-white"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full bg-white border-[#BDE8CE] text-black font-medium rounded-xl h-12 hover:bg-white transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#D5EEDD] rounded-xl shadow-lg">
                <SelectItem value="all" className="focus:bg-[#EAFBF0] focus:text-[#1A4F35] font-medium cursor-pointer">All Roles</SelectItem>
                <SelectItem value="user" className="focus:bg-[#EAFBF0] focus:text-[#1A4F35] font-medium cursor-pointer">User</SelectItem>
                <SelectItem value="companion" className="focus:bg-[#EAFBF0] focus:text-[#1A4F35] font-medium cursor-pointer">Companion</SelectItem>
                <SelectItem value="admin" className="focus:bg-[#EAFBF0] focus:text-[#1A4F35] font-medium cursor-pointer">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full bg-white border-[#BDE8CE] text-black font-medium rounded-xl h-12 hover:bg-white transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#D5EEDD] rounded-xl shadow-lg">
                <SelectItem value="all" className="focus:bg-[#EAFBF0] focus:text-[#1A4F35] font-medium cursor-pointer">All Status</SelectItem>
                <SelectItem value="active" className="focus:bg-[#EAFBF0] focus:text-[#1A4F35] font-medium cursor-pointer">Active</SelectItem>
                <SelectItem value="suspended" className="focus:bg-[#EAFBF0] focus:text-[#1A4F35] font-medium cursor-pointer">Suspended</SelectItem>
                <SelectItem value="banned" className="focus:bg-[#EAFBF0] focus:text-[#1A4F35] font-medium cursor-pointer">Banned</SelectItem>
                <SelectItem value="pending" className="focus:bg-[#EAFBF0] focus:text-[#1A4F35] font-medium cursor-pointer">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white border border-[#D5EEDD] rounded-2xl shadow-sm text-sm font-bold text-[#1A4F35] uppercase tracking-wider hidden md:grid">
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Join Date</div>
            <div className="col-span-2">Enrollments</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>

          {/* Data Rows */}
          {loading ? (
            <Card className="bg-white border-[#D5EEDD] p-12 text-center rounded-3xl shadow-sm">
              <p className="text-[#64C08E] font-medium text-lg">Loading users...</p>
            </Card>
          ) : filteredUsers.length === 0 ? (
            <Card className="bg-white border-[#D5EEDD] p-12 text-center rounded-3xl shadow-sm">
              <p className="text-[#64C08E] font-medium text-lg">No users found.</p>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="bg-white border-[#D5EEDD] p-4 md:p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow hover:border-[#BDE8CE] group animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 md:col-span-3">
                    <div className="font-bold text-[#1F4131] text-lg">{user.name}</div>
                    <div className="text-sm font-medium text-[#64C08E]">{user.email}</div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex items-center">
                    <span className="md:hidden text-[#1A4F35] font-bold text-sm uppercase tracking-wider w-24">Role:</span>
                    {getRoleBadge(user.role)}
                  </div>

                  <div className="col-span-1 md:col-span-2 flex items-center">
                    <span className="md:hidden text-[#1A4F35] font-bold text-sm uppercase tracking-wider w-24">Status:</span>
                    <StatusBadge status={user.status} variant="user" />
                  </div>

                  <div className="col-span-1 md:col-span-2 flex items-center">
                    <span className="md:hidden text-[#1A4F35] font-bold text-sm uppercase tracking-wider w-24">Joined:</span>
                    <span className="text-[#3C9162] font-medium">{user.joinDate}</span>
                  </div>

                  <div className="col-span-1 md:col-span-2 flex items-center">
                    <span className="md:hidden text-[#1A4F35] font-bold text-sm uppercase tracking-wider w-24">Courses:</span>
                    <div className="flex items-center gap-1.5 text-[#3C9162] font-semibold text-sm">
                      <GraduationCap className="w-4 h-4 text-[#86CDA6]" />
                      <span>{user.enrolledCourses?.length || 0} Enrolled</span>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-1 flex justify-end md:justify-center">
                    <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionMenu
                        variant="user"
                        onView={() => handleView(user)}
                        onSuspend={() => handleAction("suspend", user)}
                        onEdit={() => handleAction("change-role", user)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

      {/* View User Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete user account information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-black mb-2 border-b pb-1">Personal Information</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-bold text-black">Name:</span> {selectedUser.name}</p>
                    <p><span className="font-bold text-black">Email:</span> {selectedUser.email}</p>
                    <p><span className="font-bold text-black">User ID:</span> {selectedUser.id}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2 border-b pb-1">Account Details</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-black">Role:</span> {getRoleBadge(selectedUser.role)}
                    </p>
                    <p className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-black">Status:</span> 
                      <StatusBadge status={selectedUser.status} variant="user" />
                    </p>
                    <p className="mt-1"><span className="font-bold text-black">Join Date:</span> {selectedUser.joinDate}</p>
                    <p><span className="font-bold text-black">Last Active:</span> {selectedUser.lastActive}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-2 border-b pb-1">Enrolled Courses ({selectedUser.enrolledCourses?.length || 0})</h3>
                {selectedUser.enrolledCourses && selectedUser.enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {selectedUser.enrolledCourses.map((c) => (
                      <div key={c.courseId} className="flex flex-col p-3 rounded-xl border border-[#D5EEDD] bg-[#F4FAF6]">
                        <span className="font-bold text-[#1F4131] text-sm">
                          {courseMap[c.courseId] || c.courseId}
                        </span>
                        <span className="text-[11px] text-gray-400 font-semibold mt-1">
                          Enrolled: {new Date(c.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic mt-2">No courses enrolled yet.</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="border-gray-200">
              Close
            </Button>
            {selectedUser?.status === "active" && selectedUser.role !== "admin" && (
              <Button
                variant="destructive"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleAction("suspend", selectedUser);
                }}
              >
                Suspend User
              </Button>
            )}
            {selectedUser?.role !== "admin" && (
              <Button
                className="bg-[#34A46B] hover:bg-[#2c8d5c] text-white"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleAction("change-role", selectedUser);
                }}
              >
                Change Role
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction
            ? `${confirmAction.type === "suspend" ? "Suspend" : "Unblock"} User`
            : "Confirm"
        }
        description={
          confirmAction
            ? `Are you sure you want to ${
                confirmAction.type === "suspend" ? "block" : "unblock"
              } ${confirmAction.user.name}?`
            : ""
        }
        confirmText={confirmAction?.type === "suspend" ? "Block" : "Unblock"}
        onConfirm={confirmActionHandler}
        variant={confirmAction?.type === "suspend" ? "destructive" : "default"}
      />

      {/* Change Role Modal */}
      <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>Select a new role for this user.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={roleDraft} onValueChange={(value) => setRoleDraft(value as PlatformUser["role"])}>
              <SelectTrigger className="border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="companion">Companion</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleModalOpen(false)} className="border-gray-200">
              Cancel
            </Button>
            <Button
              className="bg-[#34A46B] hover:bg-[#2c8d5c] text-white"
              onClick={handleRoleSave}
            >
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
