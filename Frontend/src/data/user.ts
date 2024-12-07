type User = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: string;
};

export const USER = [
  {
    id: 1,
    firstName: "Tanner",
    lastName: "Linsley",
    age: 33,
    visits: 100,
    progress: 50,
    status: "Married",
  },
  {
    id: 2,
    firstName: "Kevin",
    lastName: "Vandy",
    age: 27,
    visits: 200,
    progress: 100,
    status: "Single",
  },
];

export const columns = [
  {
    header: "First Name",
    accessorKey: "name.first",
  },
  {
    header: "Last Name",
    accessorKey: "name.last",
  },
  {
    header: "Age",
    accessorFn: (info) => info.age,
  },
  //...
];


export 