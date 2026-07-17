export const videoProductionTemplate = {
  category: "Video Production",
  name: "Promotional Video",
  description: "End-to-end promotional video production from scripting to final cut.",
  milestones: [
    {
      name: "Pre-production",
      deliverables: [
        { name: "Script" },
        { name: "Storyboard" },
      ],
      tasks: [
        "Script writing",
        "Storyboard",
        "Shot planning",
      ],
    },
    {
      name: "Production",
      deliverables: [
        { name: "Raw Footage" },
      ],
      tasks: [
        "Recording",
        "Audio capture",
        "Lighting",
        "Backup footage",
      ],
    },
    {
      name: "Editing",
      deliverables: [
        { name: "First Cut" },
        { name: "Final Cut" },
      ],
      tasks: [
        "Editing",
        "Motion graphics",
        "Sound design",
        "Color grading",
        "Client revisions",
      ],
    },
    {
      name: "Delivery",
      deliverables: [
        { name: "4K Video" },
        { name: "Social Versions" },
      ],
      tasks: [
        "Export",
        "Compression",
        "Upload",
        "Archive project",
      ],
    },
  ],
};