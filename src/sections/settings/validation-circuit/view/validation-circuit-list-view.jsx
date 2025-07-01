// import React, { useState, useMemo, memo } from 'react';

// // --- IMPORTS FROM LIBRARIES ---
// import {
//   Box, Card, CardHeader, CardContent, Typography, IconButton, Avatar,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack,
//   Divider
// } from '@mui/material';
// import {
//   AddCircleOutline as AddCircleOutlineIcon,
//   Settings as SettingsIcon,
//   MoreVert as MoreVertIcon,
//   FolderOpen as FolderOpenIcon,
// } from '@mui/icons-material';
// import ReactFlow, { Background, Controls, Handle, Position } from 'reactflow';
// import 'reactflow/dist/style.css'; // Important: a CSS import for React Flow

// // --- IMPORTS FROM YOUR PROJECT ---
// import { paths } from 'src/routes/paths';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// // ----------------------------------------------------------------------
// // --- 1. DATA STRUCTURE ---
// // This data will drive both the editor and the visualizer.
// // ----------------------------------------------------------------------

// const initialFlowData = [
//   {
//     id: 1,
//     levelName: "Department Manager",
//     type: "sequential",
//     approvers: [
//       {
//         id: "a1",
//         name: "Kevin Dukkon",
//         title: "Accountant",
//         avatar: "https://i.pravatar.cc/150?u=kevin",
//         rules: {
//           requesters: "All Requesters",
//           departments: ["Department A", "Department B"],
//           fromDate: "12.02.2020",
//         },
//       },
//     ],
//   },
//   {
//     id: 2,
//     levelName: "Head of Finance (HOD)",
//     type: "first_to_respond",
//     approvers: [
//       {
//         id: "a2",
//         name: "Jordan Hughes",
//         title: "Finance Director at ABC",
//         avatar: "https://i.pravatar.cc/150?u=jordan",
//         rules: {
//           requesters: "Assigned Requesters",
//           departments: ["Department A"],
//           fromDate: "24.03.2021",
//         },
//       },
//       {
//         id: "a3",
//         name: "Thomas Michel",
//         initials: "TM",
//         title: "Director Of Finance And Administration",
//         rules: {
//           requesters: "All Requesters",
//           departments: ["Department A", "Department B"],
//           fromDate: "01.02.2020",
//         },
//       },
//     ],
//   },
//   {
//     id: 3,
//     levelName: "Managing Director",
//     type: "sequential",
//     approvers: [
//       {
//         id: "a4",
//         name: "Diana Palavandishvili",
//         title: "Managing Director at ABC",
//         avatar: "https://i.pravatar.cc/150?u=diana",
//         rules: {
//           requesters: "All Requesters",
//           departments: ["Department A", "Department B"],
//           fromDate: "14.01.2020",
//         },
//       },
//     ],
//   },
// ];

// // ----------------------------------------------------------------------
// // --- 2. COMPONENTS FOR THE EDITOR UI (IMAGE 1) ---
// // ----------------------------------------------------------------------

// const ApprovalStage = ({ stage }) => (
//   <Card sx={{ mb: 3 }}>
//     <CardHeader
//       avatar={
//         <Typography component="div" sx={{
//           border: '1px solid #ddd', borderRadius: '50%', width: 32, height: 32,
//           display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
//         }}>
//           {stage.id}
//         </Typography>
//       }
//       action={
//         <>
//           {stage.type === 'first_to_respond' && <Chip label="First to respond" color="warning" size="small" sx={{ mr: 1, alignSelf: 'center' }} />}
//           <IconButton aria-label="add approver"><AddCircleOutlineIcon /></IconButton>
//           <IconButton aria-label="settings"><SettingsIcon /></IconButton>
//         </>
//       }
//       title={stage.levelName}
//       titleTypographyProps={{ fontWeight: 'bold' }}
//     />
//     <CardContent sx={{ pt: 0 }}>
//       <TableContainer>
//         <Table size="small">
//           <TableHead>
//             <TableRow sx={{ '& .MuiTableCell-root': { color: 'text.secondary', border: 0 } }}>
//               <TableCell>Approver</TableCell>
//               <TableCell>Requester</TableCell>
//               <TableCell>Department</TableCell>
//               <TableCell>From Date</TableCell>
//               <TableCell align="right"></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {stage.approvers.map((approver) => (
//               <TableRow key={approver.id} sx={{ '& .MuiTableCell-root': { border: 0, py: 1.5 } }}>
//                 <TableCell>
//                   <Stack direction="row" alignItems="center" spacing={2}>
//                     <Avatar src={approver.avatar} sx={{ bgcolor: 'primary.main' }}>
//                       {approver.initials}
//                     </Avatar>
//                     <Box>
//                       <Typography variant="body2" fontWeight="medium">{approver.name}</Typography>
//                       <Typography variant="caption" color="text.secondary">{approver.title}</Typography>
//                     </Box>
//                   </Stack>
//                 </TableCell>
//                 <TableCell>{approver.rules.requesters}</TableCell>
//                 <TableCell>
//                   <Stack direction="row" spacing={1}>
//                     {approver.rules.departments.map(dep => <Chip key={dep} label={dep} size="small" />)}
//                   </Stack>
//                 </TableCell>
//                 <TableCell>{approver.rules.fromDate}</TableCell>
//                 <TableCell align="right">
//                   <IconButton size="small"><MoreVertIcon /></IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </CardContent>
//   </Card>
// );

// const ApprovalFlowEditor = ({ flowData }) => {
//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom fontWeight="bold">Medical Expenses Approval</Typography>
//       <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//         Manage the approval flow of Medical Expenses using the functions below.
//       </Typography>
//       {flowData.map((stage) => (
//         <ApprovalStage key={stage.id} stage={stage} />
//       ))}
//     </Box>
//   );
// };


// // ----------------------------------------------------------------------
// // --- 3. COMPONENTS FOR THE VISUALIZER UI (IMAGE 2) ---
// // ----------------------------------------------------------------------

// const CustomNode = memo(({ data }) => {
//   const isParallel = data.approvers.length > 1;

//   const approverCard = (approver) => (
//     <Card
//       key={approver.id}
//       variant="outlined"
//       sx={{
//         width: 250,
//         textAlign: 'left',
//         mb: isParallel ? 0 : 2,
//         mr: isParallel ? 2 : 0,
//         backgroundColor: 'white', // Ensure card background is white
//       }}
//     >
//       <CardContent>
//         <Stack direction="row" alignItems="center" spacing={2}>
//           <Avatar src={approver.avatar} sx={{ bgcolor: 'info.main', width: 40, height: 40 }}>
//             {approver.initials}
//           </Avatar>
//           <Box>
//             <Typography variant="subtitle2" fontWeight="bold">{approver.name}</Typography>
//             <Typography variant="caption" color="text.secondary">{approver.title}</Typography>
//           </Box>
//         </Stack>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <>
//       <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
//         <Box sx={{ p: 1 }}>
//           <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, color: 'text.secondary', pl: 1 }}>
//             <FolderOpenIcon fontSize="small" />
//             <Typography variant="body2" fontWeight="bold">{data.levelName}</Typography>
//           </Stack>
//           <Stack direction="row">
//             {data.approvers.map(approverCard)}
//           </Stack>
//         </Box>
//       <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
//     </>
//   );
// });

// const nodeTypes = { custom: CustomNode };

// const ApprovalFlowVisualizer = ({ flowData }) => {
//   const { nodes, edges } = useMemo(() => {
//     const initialNodes = [];
//     const initialEdges = [];
//     let lastLevelNodeIds = [];
//     const yOffset = 200;
//     const xOffset = 320;

//     flowData.forEach((level, levelIndex) => {
//       const levelY = levelIndex * yOffset;
//       const approverNodes = level.approvers.map((approver, approverIndex) => {
//         const totalWidth = level.approvers.length * xOffset;
//         const startX = -(totalWidth / 2) + (xOffset / 2);
//         return {
//           id: approver.id,
//           type: 'custom',
//           position: { x: startX + approverIndex * xOffset, y: levelY },
//           data: { levelName: level.levelName, approvers: [approver] },
//         };
//       });

//       // Simplified: one combined node per level for this specific layout
//       const nodeWidth = (level.approvers.length * 270) - (level.approvers.length > 1 ? 20 : 0);
//       const levelNode = {
//           id: `level-${level.id}`,
//           type: 'custom',
//           position: { x: -nodeWidth/2, y: levelY },
//           data: { levelName: level.levelName, approvers: level.approvers },
//           draggable: false,
//       };
//       initialNodes.push(levelNode);

//       const currentLevelNodeId = `level-${level.id}`;

//       if (lastLevelNodeIds.length > 0) {
//         lastLevelNodeIds.forEach(sourceId => {
//             initialEdges.push({
//                 id: `e-${sourceId}-${currentLevelNodeId}`,
//                 source: sourceId,
//                 target: currentLevelNodeId,
//                 type: 'smoothstep',
//             });
//         });
//       }
      
//       lastLevelNodeIds = [currentLevelNodeId];
//     });

//     return { nodes: initialNodes, edges: initialEdges };
//   }, [flowData]);


//   return (
//     <Box sx={{ height: '600px', width: '100%', p: 3, backgroundColor: '#f7f9fc', borderRadius: 2 }}>
//        <Typography variant="h5" gutterBottom fontWeight="bold">Medical Expenses Approval Flow</Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//             last updated on 23rd Jan 2022
//         </Typography>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         nodeTypes={nodeTypes}
//         fitView
//         proOptions={{ hideAttribution: true }}
//       >
//         <Background variant="dots" gap={24} size={1} />
//         <Controls showInteractive={false} />
//       </ReactFlow>
//     </Box>
//   );
// };


// // ----------------------------------------------------------------------
// // --- 4. YOUR MAIN COMPONENT ---
// // ----------------------------------------------------------------------

// export function ValidationCircuitListView() {
//   const [flowData, setFlowData] = useState(initialFlowData);

//   return (
//     <DashboardContent>
//       <CustomBreadcrumbs
//         heading='Circuit de validation'
//         links={[
//           { name: 'Paramètres', href: paths.dashboard.settings.root },
//           { name: "Circuit de validation", href: paths.dashboard.settings.validationCircuit.root },
//           { name: 'Liste' },
//         ]}
//         sx={{ mb: { xs: 3, md: 5 } }}
//       />

//       {/* RENDER JSX HERE */}
//       <Box>
//         {/* Component 1: The Editor */}
//         <ApprovalFlowEditor flowData={flowData} />

//         <Divider sx={{ my: 4 }}>
//           <Typography variant="overline">Visual Representation</Typography>
//         </Divider>

//         {/* Component 2: The Visualizer */}
//         <ApprovalFlowVisualizer flowData={flowData} />
//       </Box>

//     </DashboardContent>
//   );
// }