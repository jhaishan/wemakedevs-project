const fs = require('fs');
const file = 'src/agent/orchestrator.ts';
let code = fs.readFileSync(file, 'utf8');
code = code.replace('let complaint = await complaintService.findById(id);', 'let complaint: any = await complaintService.findById(id);');
fs.writeFileSync(file, code);

const file2 = 'src/controllers/complaints.controller.ts';
let code2 = fs.readFileSync(file2, 'utf8');
code2 = code2.replace(/req\.params\.id/g, 'req.params.id as string');
fs.writeFileSync(file2, code2);
