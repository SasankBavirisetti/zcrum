// "use client";

// import { useEffect } from "react";
// import { BarLoader } from "react-spinners";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
// } from "@/components/ui/drawer";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import MDEditor from "@uiw/react-md-editor";
// import useFetch from "@/hooks/use-fetch";
// import { createIssue } from "@/actions/issues";
// import { getOrganizationUsers } from "@/actions/organizations";
// import { issueSchema } from "@/app/lib/validators";

// export default function IssueCreationDrawer({
//   isOpen,
//   onClose,
//   sprintId,
//   status,
//   projectId,
//   onIssueCreated,
//   orgId,
// }) {
//   const {
//     loading: createIssueLoading,
//     fn: createIssueFn,
//     error,
//     data: newIssue,
//   } = useFetch(createIssue);

//   const {
//     loading: usersLoading,
//     fn: fetchUsers,
//     data: users,
//   } = useFetch(getOrganizationUsers);

//   const {
//     control,
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: zodResolver(issueSchema),
//     defaultValues: {
//       priority: "MEDIUM",
//       description: "",
//       assigneeId: "",
//     },
//   });

//   useEffect(() => {
//     if (isOpen && orgId) {
//       fetchUsers(orgId);
//     }
//   }, [isOpen, orgId]);

//   const onSubmit = async (data) => {
//     await createIssueFn(projectId, {
//       ...data,
//       status,
//       sprintId,
//     });
//   };

//   useEffect(() => {
//     if (newIssue) {
//       reset();
//       onClose();
//       onIssueCreated();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [newIssue, createIssueLoading]);

//   return (
//     <Drawer open={isOpen} onClose={onClose}>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>Create New Issue</DrawerTitle>
//         </DrawerHeader>
//         {usersLoading && <BarLoader width={"100%"} color="#36d7b7" />}
//         <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium mb-1">
//               Title
//             </label>
//             <Input id="title" {...register("title")} />
//             {errors.title && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.title.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="assigneeId"
//               className="block text-sm font-medium mb-1"
//             >
//               Assignee
//             </label>
//             <Controller
//               name="assigneeId"
//               control={control}
//               render={({ field }) => {
//                 // 1. Declare the finder variable inside the render function scope
//                 const selectedUser = users?.find((u) => u.id === field.value);

//                 return (
//                   <Select
//                     onValueChange={field.onChange}
//                     value={field.value || ""} // 2. Enforce a clean controlled state parameter
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select assignee">
//                         {/* 3. Render the name safely with optional chaining */}
//                         {selectedUser ? selectedUser?.name : "Select assignee"}
//                       </SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       {users?.map((user) => (
//                         <SelectItem key={user.id} value={user.id}>
//                           {user?.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 );
//               }}
//             />
//             {errors.assigneeId && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.assigneeId.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="description"
//               className="block text-sm font-medium mb-1"
//             >
//               Description
//             </label>
//             <Controller
//               name="description"
//               control={control}
//               render={({ field }) => (
//                 <MDEditor value={field.value} onChange={field.onChange} />
//               )}
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="priority"
//               className="block text-sm font-medium mb-1"
//             >
//               Priority
//             </label>
//             <Controller
//               name="priority"
//               control={control}
//               render={({ field }) => {
//                 // 1. Map uppercase form values to human-readable UI text
//                 const priorityLabels = {
//                   LOW: "Low",
//                   MEDIUM: "Medium",
//                   HIGH: "High",
//                   URGENT: "Urgent",
//                 };

//                 return (
//                   <Select
//                     onValueChange={field.onChange}
//                     value={field.value || "MEDIUM"} // 2. Enforce a clean controlled state parameter
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select priority">
//                         {/* 3. Render the user-friendly label with fallback */}
//                         {priorityLabels[field.value] || "Medium"}
//                       </SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       {/* 4. Keep values uppercase to match your database schema requirements */}
//                       <SelectItem value="LOW">Low</SelectItem>
//                       <SelectItem value="MEDIUM">Medium</SelectItem>
//                       <SelectItem value="HIGH">High</SelectItem>
//                       <SelectItem value="URGENT">Urgent</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 );
//               }}
//             />
//           </div>

//           {error && <p className="text-red-500 mt-2">{error.message}</p>}
//           <Button
//             type="submit"
//             disabled={createIssueLoading}
//             className="w-full"
//           >
//             {createIssueLoading ? "Creating..." : "Create Issue"}
//           </Button>
//         </form>
//       </DrawerContent>
//     </Drawer>
//   );
// }




"use client";

import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose, // ✅ FIXED: Imported DrawerClose wrapper tool component token
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import useFetch from "@/hooks/use-fetch";
import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organizations";
import { issueSchema } from "@/app/lib/validators";
import { X } from "lucide-react"; // ✅ FIXED: Imported standard cancel close vector icon layout element

export default function IssueCreationDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) {
  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUsers);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsers(orgId);
    }
  }, [isOpen, orgId]);

  const onSubmit = async (data) => {
    await createIssueFn(projectId, {
      ...data,
      status,
      sprintId,
    });
  };

  useEffect(() => {
    if (newIssue) {
      reset();
      onClose();
      onIssueCreated();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newIssue, createIssueLoading]);

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        {/* ✅ FIXED: Styled the header to be a flex container with space-between positioning */}
        <DrawerHeader className="flex flex-row justify-between items-center pr-6">
          <DrawerTitle>Create New Issue</DrawerTitle>
          
          {/* ✅ FIXED: Injected an explicit top-right cancellation exit trigger button item */}
          <DrawerClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        
        {usersLoading && <BarLoader width={"100%"} color="#36d7b7" />}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="assigneeId"
              className="block text-sm font-medium mb-1"
            >
              Assignee
            </label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => {
                const selectedUser = users?.find((u) => u.id === field.value);

                return (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""} 
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee">
                        {selectedUser ? selectedUser?.name : "Select assignee"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {errors.assigneeId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.assigneeId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MDEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-1"
            >
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => {
                const priorityLabels = {
                  LOW: "Low",
                  MEDIUM: "Medium",
                  HIGH: "High",
                  URGENT: "Urgent",
                };

                return (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "MEDIUM"} 
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority">
                        {priorityLabels[field.value] || "Medium"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                );
              }}
            />
          </div>

          {error && <p className="text-red-500 mt-2">{error.message}</p>}
          <Button
            type="submit"
            disabled={createIssueLoading}
            className="w-full"
          >
            {createIssueLoading ? "Creating..." : "Create Issue"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
