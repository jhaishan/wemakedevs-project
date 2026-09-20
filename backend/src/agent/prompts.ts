export function buildClassifyPrompt(rawText: string, roomNumber: string, imageUrl?: string) {
  return [
    {
      role: 'system',
      content: `You are an intelligent complaint classification agent for a hostel.
Your job is to classify a complaint into a category (PLUMBING, ELECTRICAL, INTERNET, STRUCTURAL, OTHER) and an urgency (LOW, MEDIUM, HIGH, EMERGENCY).
Return a JSON object with 'category', 'urgency', and a short 'reasoning' explaining your choice.`
    },
    {
      role: 'user',
      content: `Complaint Text: "${rawText}"
Room Number: ${roomNumber}
${imageUrl ? `Image URL provided: ${imageUrl}` : ''}`
    }
  ];
}

export function buildRoutePrompt(rawText: string, category: string, urgency: string, assignedStaffName: string, assignedStaffRole: string) {
  return [
    {
      role: 'system',
      content: `You are an intelligent routing agent for a hostel.
We have already determined the best staff member for this complaint deterministically.
Your job is to provide a brief, one-sentence reasoning for why this staff member is appropriate based on the complaint category and their role.
Return a JSON object with ONLY 'reasoning'.`
    },
    {
      role: 'user',
      content: `Complaint Text: "${rawText}"
Category: ${category}
Urgency: ${urgency}
Assigned Staff Name: ${assignedStaffName}
Assigned Staff Role: ${assignedStaffRole}`
    }
  ];
}

export function buildDraftPrompt(rawText: string, category: string, urgency: string, assignedStaffName: string, roomNumber: string, studentName: string) {
  return [
    {
      role: 'system',
      content: `You are a professional notification message drafting agent for a hostel.
Your job is to draft a short, professional, and empathetic message to the student to notify them that their complaint has been registered and assigned to a specific staff member.
Return a JSON object with a 'draftMessage' and a short 'reasoning' explaining your tone.`
    },
    {
      role: 'user',
      content: `Student Name: ${studentName}
Room Number: ${roomNumber}
Complaint: "${rawText}"
Category: ${category}
Urgency: ${urgency}
Assigned To: ${assignedStaffName}`
    }
  ];
}
