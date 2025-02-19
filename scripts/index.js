const initialcards = [
  { name: "Val Thorens", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg" },
  { name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg" },
  { name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg" },
  { name: "A very long bridge, over the forest and through the trees", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg" },
  { name: "Tunnel with morning light", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg" },
  { name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg" },
];

const profileEditButton = document.querySelector(".profile__edit-btn");
const newPostButton = document.querySelector(".profile__add-btn");
const cardEditButton = document.querySelector(".New-post-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalcloseButton = editModal.querySelector(".modal__close-btn");
const editModalNameinput = editModal.querySelector("#profile-name-input");
const editModalDescriptioninput = editModal.querySelector("#profile-description-input");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form")
const cardModalCloseButton = cardModal.querySelector(".modal__close-btn");
const CardNameInput = cardModal.querySelector("#add-card-name-input");
const CardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl =previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");


const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function handleAddCardSubmit(evt) {
  evt.preventDefault();
const inputValues = { name: CardNameInput.value, link: CardLinkInput.value}
const cardElement = getCardElement(inputValues);
cardsList.prepend(cardElement);
closeModal(cardModal);
};

function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardNameEl.textContent = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });


  previewModalCloseButton.addEventListener("click", () => {
    closeModal(previewModal);
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);

    previewModalImageEl.src = data.link;
    previewModalCaptionEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("card__delete-btn");
  cardElement.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });


  return cardElement;
}


function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault ();
  profileName.textContent = editModalNameinput.value;
  profileDescription.textContent = editModalDescriptioninput.value;
  closeModal(editModal);
}

profileEditButton.addEventListener ("click", () => {
  editModalNameinput.value = profileName.textContent;
  editModalDescriptioninput.value = profileDescription.textContent;
  openModal(editModal)
});
editModalcloseButton.addEventListener("click", () => {
  closeModal(editModal)
});

newPostButton.addEventListener ("click", () => {
  openModal(cardModal)
});
cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal)
});


editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

for (let i = 0; i < initialcards.length; i++ ) {
  const cardElement = getCardElement(initialcards [i]);
  cardsList.prepend(cardElement);
}

initialcards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});