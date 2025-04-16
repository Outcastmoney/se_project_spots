import "../pages/index.css";
import {
  enableValidation,
  resetValidation,
  validationConfig,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

document.addEventListener("DOMContentLoaded", () => {
  const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: "ed2f116d-06a5-4c31-b927-102a00e07592",
      "Content-Type": "application/json",
    },
  });

  const profileEditButton = document.querySelector(".profile__edit-btn");
  const newPostButton = document.querySelector(".profile__add-btn");
  const profileName = document.querySelector(".profile__name");
  const profileDescription = document.querySelector(".profile__description");
  const profileAvatar = document.querySelector(".profile__avatar");
  const avatarBtn = document.querySelector(".profile__avatar-btn");

  const editModal = document.querySelector("#edit-modal");
  const editFormElement = editModal.querySelector(".modal__form");
  const editModalCloseButton = editModal.querySelector(".modal__close-btn");
  const editModalNameInput = editModal.querySelector("#profile-name-input");
  const editModalDescriptionInput = editModal.querySelector(
    "#profile-description-input"
  );

  const cardModal = document.querySelector("#add-card-modal");
  const cardForm = cardModal.querySelector(".modal__form");
  const cardModalCloseButton = cardModal.querySelector(".modal__close-btn");
  const cardNameInput = cardModal.querySelector("#add-card-name-input");
  const cardLinkInput = cardModal.querySelector("#add-card-link-input");

  const avatarModal = document.querySelector("#avatar-modal");
  const avatarForm = avatarModal.querySelector(".modal__form");
  const avatarModalCloseButton = avatarModal.querySelector(".modal__close-btn");
  const avatarInput = avatarModal.querySelector("#profile-avatar-input");

  const previewModal = document.querySelector("#preview-modal");
  const previewModalImageEl = previewModal.querySelector(".modal__image");
  const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
  const previewModalCloseButton =
    previewModal.querySelector(".modal__close-btn");

  const cardTemplate = document.querySelector("#card-template");
  const cardsList = document.querySelector(".cards__list");

  function getCardElement(data) {
    const cardElement = cardTemplate.content
      .querySelector(".card")
      .cloneNode(true);
    const cardNameEl = cardElement.querySelector(".card__title");
    const cardImageEl = cardElement.querySelector(".card__image");
    const cardLikeBtn = cardElement.querySelector(".card__like-btn");
    const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;
    cardNameEl.textContent = data.name;

    cardLikeBtn.addEventListener("click", () => {
      cardLikeBtn.classList.toggle("card__like-btn_liked");
    });

    cardImageEl.addEventListener("click", () => {
      openModal(previewModal);
      previewModalImageEl.src = data.link;
      previewModalImageEl.alt = data.name;
      previewModalCaptionEl.textContent = data.name;
    });

    cardDeleteBtn.addEventListener("click", () => {
      cardElement.remove();
    });

    return cardElement;
  }

  function openModal(modal) {
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", closeOnEscape);
  }

  function closeModal(modal) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", closeOnEscape);
  }

  function closeOnEscape(event) {
    if (event.key === "Escape") {
      const openedModal = document.querySelector(".modal.modal_opened");
      if (openedModal) {
        closeModal(openedModal);
      }
    }
  }

  function handleEditFormSubmit(evt) {
    evt.preventDefault();
    api
      .editUserInfo({
        name: editModalNameInput.value,
        about: editModalDescriptionInput.value,
      })
      .then((data) => {
        profileName.textContent = data.name;
        profileDescription.textContent = data.about;
        closeModal(editModal);
      })
      .catch(console.error);
  }

  function handleAddCardSubmit(evt) {
    evt.preventDefault();
    const inputValues = {
      name: cardNameInput.value,
      link: cardLinkInput.value,
    };
    const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);
    evt.target.reset();
    resetValidation(cardForm, validationConfig);
    closeModal(cardModal);
  }

  function handleAvatarSubmit(evt) {
    evt.preventDefault();
    api
      .editAvatarInfo({ avatar: avatarInput.value })
      .then((data) => {
        profileAvatar.src = data.avatar;
        closeModal(avatarModal);
        evt.target.reset();
        resetValidation(avatarForm, validationConfig);
      })
      .catch(console.error);
  }

  profileEditButton.addEventListener("click", () => {
    editModalNameInput.value = profileName.textContent;
    editModalDescriptionInput.value = profileDescription.textContent;
    resetValidation(editFormElement, validationConfig);
    openModal(editModal);
  });

  newPostButton.addEventListener("click", () => openModal(cardModal));
  avatarBtn.addEventListener("click", () => {
    console.log("Avatar button clicked");
    openModal(avatarModal);
  });

  editModalCloseButton.addEventListener("click", () => closeModal(editModal));
  cardModalCloseButton.addEventListener("click", () => closeModal(cardModal));
  avatarModalCloseButton.addEventListener("click", () =>
    closeModal(avatarModal)
  );
  previewModalCloseButton.addEventListener("click", () =>
    closeModal(previewModal)
  );

  editFormElement.addEventListener("submit", handleEditFormSubmit);
  cardForm.addEventListener("submit", handleAddCardSubmit);
  avatarForm.addEventListener("submit", handleAvatarSubmit);

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  enableValidation(validationConfig);

  api
    .getAppInfo()
    .then(([cards, user]) => {
      cards.forEach((item) => {
        const cardElement = getCardElement(item);
        cardsList.prepend(cardElement);
      });
      profileName.textContent = user.name;
      profileDescription.textContent = user.about;
      profileAvatar.src = user.avatar;
    })
    .catch(console.error);
});
