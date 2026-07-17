export const photographyTemplate = {
  category: "Photography",
  name: "Event Photography",
  description: "End-to-end event photography workflow from planning to final gallery delivery.",
  milestones: [
    {
      name: "Planning",
      deliverables: [
        { name: "Shoot Schedule" },
      ],
      tasks: [
        "Client briefing",
        "Location scouting",
        "Equipment preparation",
      ],
    },
    {
      name: "Shoot Day",
      deliverables: [
        { name: "RAW Photos" },
      ],
      tasks: [
        "Photography",
        "Backup storage",
        "Equipment management",
      ],
    },
    {
      name: "Post Processing",
      deliverables: [
        { name: "Edited Photos" },
      ],
      tasks: [
        "Culling",
        "Color correction",
        "Retouching",
        "Export",
      ],
    },
    {
      name: "Delivery",
      deliverables: [
        { name: "Final Gallery" },
      ],
      tasks: [
        "Upload gallery",
        "Client download",
        "Archive project",
      ],
    },
  ],
};