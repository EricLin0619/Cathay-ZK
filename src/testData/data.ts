const circuits = [
  {
    id: 1,
    name: "circuit 1",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi distinctio, molestias aut sequi non ex autem!",
    conditions: [
      { name: "age", logic: ">", value: 18 },
      { name: "resident", logic: "==", value: "true" }
    ]
  },
  {
    id: 2,
    name: "circuit 2",
    description: "Dolor sit amet consectetur adipisicing elit. Quasi distinctio, molestias aut sequi non ex autem!",
    conditions: [
      { name: "income", logic: ">=", value: 50000 },
      { name: "credit_score", logic: ">", value: 700 }
    ]
  },
  {
    id: 3,
    name: "circuit 3",
    description: "Consectetur adipisicing elit. Quasi distinctio, molestias aut sequi non ex autem!",
    conditions: [
      { name: "education_level", logic: ">=", value: "bachelor" },
      { name: "work_experience", logic: ">=", value: 5 }
    ]
  },
  {
    id: 4,
    name: "circuit 4",
    description: "Adipisicing elit. Quasi distinctio, molestias aut sequi non ex autem!",
    conditions: [
      { name: "driving_license", logic: "==", value: "true" },
      { name: "accidents", logic: "==", value: 0 }
    ]
  },
  {
    id: 5,
    name: "circuit 5",
    description: "Elit. Quasi distinctio, molestias aut sequi non ex autem!",
    conditions: [
      { name: "membership_years", logic: ">", value: 2 },
      { name: "loyalty_points", logic: ">=", value: 1000 }
    ]
  },
  {
    id: 6,
    name: "circuit 6",
    description: "Quasi distinctio, molestias aut sequi non ex autem!",
    conditions: [
      { name: "health_score", logic: ">", value: 80 },
      { name: "bmi", logic: "<", value: 25 }
    ]
  },
  {
    id: 7,
    name: "circuit 7",
    description: "Distinctio, molestias aut sequi non ex autem!",
    conditions: [
      { name: "savings_balance", logic: ">", value: 10000 },
      { name: "debt_ratio", logic: "<", value: 0.3 }
    ]
  },
  {
    id: 8,
    name: "circuit 8",
    description: "Molestias aut sequi non ex autem!",
    conditions: [
      { name: "test_score", logic: ">=", value: 85 },
      { name: "attendance_rate", logic: ">", value: 0.9 }
    ]
  },
  {
    id: 9,
    name: "circuit 9",
    description: "Aut sequi non ex autem!",
    conditions: [
      { name: "project_completion", logic: "==", value: "true" },
      { name: "client_satisfaction", logic: ">", value: 4.5 }
    ]
  },
  {
    id: 10,
    name: "circuit 10",
    description: "Sequi non ex autem!",
    conditions: [
      { name: "subscription_type", logic: "==", value: "premium" },
      { name: "usage_frequency", logic: ">", value: 5 }
    ]
  },
  {
    id: 11,
    name: "circuit 11",
    description: "Sequi non ex autem!",
    conditions: [
      { name: "subscription_type", logic: "==", value: "premium" },
      { name: "usage_frequency", logic: ">", value: 5 }
    ]
  },
  {
    id: 12,
    name: "circuit 12",
    description: "Sequi non ex autem!",
    conditions: [
      { name: "subscription_type", logic: "==", value: "premium" },
      { name: "usage_frequency", logic: ">", value: 5 }
    ]
  },
];

export default circuits;
