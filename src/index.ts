import express from "express";

// ======================================================
// 🐾 PAWFECT HOME — PET ADOPTION API
// ======================================================

interface Pet {
  id: number;
  name: string;
  species: string;
  age: number;
  gender: string;
  adoptionStatus: string;
}

const app = express();
const port = 3000;

// ======================================================
// ⚙️ MIDDLEWARE
// ======================================================

app.use(express.json());
app.use(express.static("public"));

// ======================================================
// 🐶 IN-MEMORY DATA STORE
// ======================================================

let pets: Pet[] = [
  {
    id: 1,
    name: "Milo",
    species: "Cat",
    age: 2,
    gender: "Male",
    adoptionStatus: "Available"
  },
  {
    id: 2,
    name: "Luna",
    species: "Dog",
    age: 3,
    gender: "Female",
    adoptionStatus: "Available"
  },
  {
    id: 3,
    name: "Coco",
    species: "Rabbit",
    age: 1,
    gender: "Female",
    adoptionStatus: "Adopted"
  }
];

// ======================================================
// 🔍 GET — ALL PETS + SEARCH/FILTER
// ======================================================

app.get("/pets", (req, res) => {
  const { name, species, gender, adoptionStatus } = req.query;

  let result = pets;

  if (name) {
    result = result.filter((pet) =>
      pet.name.toLowerCase().includes(String(name).toLowerCase())
    );
  }

  if (species) {
    result = result.filter(
      (pet) =>
        pet.species.toLowerCase() === String(species).toLowerCase()
    );
  }

  if (gender) {
    result = result.filter(
      (pet) =>
        pet.gender.toLowerCase() === String(gender).toLowerCase()
    );
  }

  if (adoptionStatus) {
    result = result.filter(
      (pet) =>
        pet.adoptionStatus.toLowerCase() ===
        String(adoptionStatus).toLowerCase()
    );
  }

  res.status(200).json(result);
});

// ======================================================
// 🔎 GET — PET BY ID
// ======================================================

app.get("/pets/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid pet ID."
    });
  }

  const pet = pets.find((pet) => pet.id === id);

  if (!pet) {
    return res.status(404).json({
      message: "Pet not found."
    });
  }

  res.status(200).json(pet);
});

// ======================================================
// ➕ POST — ADD NEW PET
// ======================================================

app.post("/pets", (req, res) => {
  const { name, species, age, gender, adoptionStatus } = req.body;

  if (
    !name ||
    !species ||
    age === undefined ||
    !gender ||
    !adoptionStatus
  ) {
    return res.status(400).json({
      message: "Please complete all fields."
    });
  }

  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    typeof species !== "string" ||
    species.trim() === ""
  ) {
    return res.status(400).json({
      message: "Name and species cannot be empty."
    });
  }

  if (
    typeof age !== "number" ||
    !Number.isFinite(age) ||
    age < 0
  ) {
    return res.status(400).json({
      message: "Age must be 0 or greater."
    });
  }

  if (!["Male", "Female"].includes(gender)) {
    return res.status(400).json({
      message: "Gender must be Male or Female."
    });
  }

  if (!["Available", "Adopted"].includes(adoptionStatus)) {
    return res.status(400).json({
      message: "Invalid adoption status."
    });
  }

  const newId =
    pets.length > 0
      ? Math.max(...pets.map((pet) => pet.id)) + 1
      : 1;

  const newPet: Pet = {
    id: newId,
    name: name.trim(),
    species: species.trim(),
    age,
    gender,
    adoptionStatus
  };

  pets.push(newPet);

  res.status(201).json(newPet);
});

// ======================================================
// ✏️ PATCH — EDIT PET
// ======================================================

app.patch("/pets/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid pet ID."
    });
  }

  const petIndex = pets.findIndex((pet) => pet.id === id);

  if (petIndex === -1) {
    return res.status(404).json({
      message: "Pet not found."
    });
  }

  const { name, species, age, gender, adoptionStatus } = req.body;

  if (
    name === undefined &&
    species === undefined &&
    age === undefined &&
    gender === undefined &&
    adoptionStatus === undefined
  ) {
    return res.status(400).json({
      message: "Please provide at least one field to update."
    });
  }

  if (
    name !== undefined &&
    (typeof name !== "string" || name.trim() === "")
  ) {
    return res.status(400).json({
      message: "Name cannot be empty."
    });
  }

  if (
    species !== undefined &&
    (typeof species !== "string" || species.trim() === "")
  ) {
    return res.status(400).json({
      message: "Species cannot be empty."
    });
  }

  if (
    age !== undefined &&
    (typeof age !== "number" || !Number.isFinite(age) || age < 0)
  ) {
    return res.status(400).json({
      message: "Age must be 0 or greater."
    });
  }

  if (
    gender !== undefined &&
    !["Male", "Female"].includes(gender)
  ) {
    return res.status(400).json({
      message: "Gender must be Male or Female."
    });
  }

  if (
    adoptionStatus !== undefined &&
    !["Available", "Adopted"].includes(adoptionStatus)
  ) {
    return res.status(400).json({
      message: "Invalid adoption status."
    });
  }

  if (name !== undefined) {
    pets[petIndex].name = name.trim();
  }

  if (species !== undefined) {
    pets[petIndex].species = species.trim();
  }

  if (age !== undefined) {
    pets[petIndex].age = age;
  }

  if (gender !== undefined) {
    pets[petIndex].gender = gender;
  }

  if (adoptionStatus !== undefined) {
    pets[petIndex].adoptionStatus = adoptionStatus;
  }

  res.status(200).json(pets[petIndex]);
});

// ======================================================
// 🗑️ DELETE — DELETE PET
// ======================================================

app.delete("/pets/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid pet ID."
    });
  }

  const petIndex = pets.findIndex((pet) => pet.id === id);

  if (petIndex === -1) {
    return res.status(404).json({
      message: "Pet not found."
    });
  }

  const deletedPet = pets[petIndex];

  pets.splice(petIndex, 1);

  res.status(200).json(deletedPet);
});

// ======================================================
// 🚀 START SERVER
// ======================================================

app.listen(port, () => {
  console.log("🐾 Pawfect Home is running!");
  console.log(`🌷 Website: http://localhost:${port}`);
});