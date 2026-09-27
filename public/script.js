// ======================================================
// 🐾 PAWFECT HOME — FRONTEND JAVASCRIPT
// ======================================================


// ------------------------------------------------------
// 🌷 ELEMENTS
// ------------------------------------------------------

const petList = document.getElementById("pet-list");
const emptyState = document.getElementById("empty-state");

const searchInput = document.getElementById("search-input");
const speciesFilter = document.getElementById("species-filter");
const genderFilter = document.getElementById("gender-filter");
const statusFilter = document.getElementById("status-filter");

const addPetButton = document.getElementById("add-pet-button");

const petModal = document.getElementById("pet-modal");
const closeModalButton = document.getElementById("close-modal");
const cancelButton = document.getElementById("cancel-button");

const petForm = document.getElementById("pet-form");
const modalTitle = document.getElementById("modal-title");
const formMessage = document.getElementById("form-message");

const petIdInput = document.getElementById("pet-id");
const petNameInput = document.getElementById("pet-name");
const petSpeciesInput = document.getElementById("pet-species");
const petAgeInput = document.getElementById("pet-age");
const petGenderInput = document.getElementById("pet-gender");
const petStatusInput = document.getElementById("pet-status");

const deleteModal = document.getElementById("delete-modal");
const deletePetName = document.getElementById("delete-pet-name");
const cancelDeleteButton = document.getElementById("cancel-delete");
const confirmDeleteButton = document.getElementById("confirm-delete");

const toast = document.getElementById("toast");

let petToDelete = null;


// ------------------------------------------------------
// 🐶 PET EMOJI
// ------------------------------------------------------

function getPetEmoji(species) {

  if (species.toLowerCase() === "cat") {
    return "🐱";
  }

  if (species.toLowerCase() === "dog") {
    return "🐶";
  }

  if (species.toLowerCase() === "rabbit") {
    return "🐰";
  }

  return "🐾";
}


// ------------------------------------------------------
// 🌸 TOAST MESSAGE
// ------------------------------------------------------

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


// ------------------------------------------------------
// 🔍 LOAD + FILTER PETS
// ------------------------------------------------------

async function loadPets() {

  try {

    const params = new URLSearchParams();

    const name = searchInput.value.trim();
    const species = speciesFilter.value;
    const gender = genderFilter.value;
    const adoptionStatus = statusFilter.value;


    if (name) {
      params.append("name", name);
    }

    if (species) {
      params.append("species", species);
    }

    if (gender) {
      params.append("gender", gender);
    }

    if (adoptionStatus) {
      params.append(
        "adoptionStatus",
        adoptionStatus
      );
    }


    const queryString = params.toString();

    const url =
      queryString
        ? `/pets?${queryString}`
        : "/pets";


    const response = await fetch(url);

    const pets = await response.json();


    petList.innerHTML = "";


    if (pets.length === 0) {

      emptyState.classList.remove("hidden");

      return;
    }


    emptyState.classList.add("hidden");


    pets.forEach((pet) => {

      const card =
        document.createElement("div");

      card.className = "pet-card";


      const statusClass =
        pet.adoptionStatus === "Adopted"
          ? "status adopted"
          : "status";


      card.innerHTML = `
        <div class="pet-icon">
          ${getPetEmoji(pet.species)}
        </div>

        <h3>${pet.name}</h3>

        <div class="pet-info">
          <p>🐾 ${pet.species}</p>
          <p>🎂 ${pet.age} year(s) old</p>
          <p>💗 ${pet.gender}</p>
        </div>

        <span class="${statusClass}">
          ${pet.adoptionStatus}
        </span>

        <div class="card-actions">

          <button
            class="edit-button"
            data-id="${pet.id}"
          >
            ✏️ Edit
          </button>

          <button
            class="delete-button"
            data-id="${pet.id}"
            data-name="${pet.name}"
          >
            🗑️ Delete
          </button>

        </div>
      `;


      petList.appendChild(card);
    });


    addCardButtonEvents();


  } catch (error) {

    console.error(error);

    petList.innerHTML =
      "<p>😿 Sorry, we could not load the pets.</p>";
  }
}


// ------------------------------------------------------
// 🔎 SEARCH + FILTER EVENTS
// ------------------------------------------------------

searchInput.addEventListener(
  "input",
  loadPets
);

speciesFilter.addEventListener(
  "change",
  loadPets
);

genderFilter.addEventListener(
  "change",
  loadPets
);

statusFilter.addEventListener(
  "change",
  loadPets
);


// ------------------------------------------------------
// ➕ OPEN ADD PET FORM
// ------------------------------------------------------

addPetButton.addEventListener(
  "click",
  () => {

    petForm.reset();

    petIdInput.value = "";

    modalTitle.textContent =
      "Add a New Pet 🐾";

    formMessage.textContent = "";

    petStatusInput.value = "Available";

    petModal.classList.remove("hidden");
  }
);


// ------------------------------------------------------
// ❌ CLOSE PET FORM
// ------------------------------------------------------

function closePetModal() {

  petModal.classList.add("hidden");

  petForm.reset();

  petIdInput.value = "";

  formMessage.textContent = "";
}


closeModalButton.addEventListener(
  "click",
  closePetModal
);

cancelButton.addEventListener(
  "click",
  closePetModal
);


// ------------------------------------------------------
// ✏️ OPEN EDIT FORM
// ------------------------------------------------------

async function openEditPet(id) {

  try {

    const response =
      await fetch(`/pets/${id}`);

    if (!response.ok) {

      showToast("😿 Pet not found.");

      return;
    }


    const pet = await response.json();


    petIdInput.value = pet.id;
    petNameInput.value = pet.name;
    petSpeciesInput.value = pet.species;
    petAgeInput.value = pet.age;
    petGenderInput.value = pet.gender;
    petStatusInput.value = pet.adoptionStatus;

    modalTitle.textContent =
      `Edit ${pet.name} ✏️`;

    formMessage.textContent = "";

    petModal.classList.remove("hidden");


  } catch (error) {

    console.error(error);

    showToast("Something went wrong.");
  }
}


// ------------------------------------------------------
// 💾 ADD OR UPDATE PET
// ------------------------------------------------------

petForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const id = petIdInput.value;


    const petData = {

      name: petNameInput.value.trim(),

      species: petSpeciesInput.value,

      age: Number(petAgeInput.value),

      gender: petGenderInput.value,

      adoptionStatus:
        petStatusInput.value
    };


    try {

      let response;


      // ✏️ UPDATE
      if (id) {

        response = await fetch(
          `/pets/${id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(petData)
          }
        );

      }

      // ➕ CREATE
      else {

        response = await fetch(
          "/pets",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(petData)
          }
        );

      }


      const result =
        await response.json();


      if (!response.ok) {

        formMessage.textContent =
          result.message ||
          "Something went wrong.";

        return;
      }


      closePetModal();

      await loadPets();


      if (id) {

        showToast(
          "🌷 Pet updated successfully!"
        );

      } else {

        showToast(
          "🐾 New pet added successfully!"
        );
      }


  } catch (error) {

    console.error(error);

    formMessage.textContent =
      "Unable to connect to the server.";
  }
});


// ------------------------------------------------------
// 🗑️ OPEN DELETE CONFIRMATION
// ------------------------------------------------------

function openDeleteModal(id, name) {

  petToDelete = id;

  deletePetName.textContent = name;

  deleteModal.classList.remove("hidden");
}


// ------------------------------------------------------
// 🗑️ CANCEL DELETE
// ------------------------------------------------------

cancelDeleteButton.addEventListener(
  "click",
  () => {

    petToDelete = null;

    deleteModal.classList.add("hidden");
  }
);


// ------------------------------------------------------
// 🗑️ CONFIRM DELETE
// ------------------------------------------------------

confirmDeleteButton.addEventListener(
  "click",
  async () => {

    if (!petToDelete) {
      return;
    }


    try {

      const response =
        await fetch(
          `/pets/${petToDelete}`,
          {
            method: "DELETE"
          }
        );


      if (!response.ok) {

        const result =
          await response.json();

        showToast(
          result.message ||
          "Unable to delete pet."
        );

        return;
      }


      petToDelete = null;

      deleteModal.classList.add("hidden");

      await loadPets();

      showToast(
        "🐾 Pet removed successfully."
      );


    } catch (error) {

      console.error(error);

      showToast(
        "Unable to connect to the server."
      );
    }
  }
);


// ------------------------------------------------------
// 🖱️ CARD BUTTON EVENTS
// ------------------------------------------------------

function addCardButtonEvents() {

  const editButtons =
    document.querySelectorAll(
      ".edit-button"
    );


  editButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        openEditPet(
          button.dataset.id
        );
      }
    );
  });


  const deleteButtons =
    document.querySelectorAll(
      ".delete-button"
    );


  deleteButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        openDeleteModal(
          button.dataset.id,
          button.dataset.name
        );
      }
    );
  });
}


// ------------------------------------------------------
// 🌷 CLOSE MODAL WHEN CLICKING BACKGROUND
// ------------------------------------------------------

petModal.addEventListener(
  "click",
  (event) => {

    if (event.target === petModal) {
      closePetModal();
    }
  }
);


deleteModal.addEventListener(
  "click",
  (event) => {

    if (event.target === deleteModal) {

      petToDelete = null;

      deleteModal.classList.add("hidden");
    }
  }
);


// ------------------------------------------------------
// 🚀 INITIAL LOAD
// ------------------------------------------------------

loadPets();