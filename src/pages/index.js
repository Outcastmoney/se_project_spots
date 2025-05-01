import "../pages/index.css";

import {
  enableValidation,
  resetValidation,
  validationConfig,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helper.js";


document.addEventListener("DOMContentLoaded", () => {
  const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: "ed2f116d-06a5-4c31-b927-102a00e07592",
      "Content-Type": "application/json",
    },
  });

  let currentUserId = null;
  let selectedCard = null;
  let selectedCardId = null;

  const profileEditButton = document.querySelector(".profile__edit-btn");
  const newPostButton = document.querySelector(".profile__add-btn");
  const profileName = document.querySelector(".profile__name");
  const profileDescription = document.querySelector(".profile__description");
  const profileAvatar = document.querySelector(".profile__avatar");
  const avatarBtn = document.querySelector(".profile__avatar-btn");

  const deleteModal = document.querySelector("#delete-modal");
  const deleteModalCloseButton = deleteModal.querySelector(".modal__close-btn");
  const deleteModalSubmitButton =
    deleteModal.querySelector(".modal__submit-btn");
  const deleteForm = deleteModal.querySelector(".modal__form");

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

    if (currentUserId && data.likes) {
      const isLiked = data.likes.some(
        (like) => like._id === currentUserId || like === currentUserId
      );
      if (isLiked) {
        cardLikeBtn.classList.add("card__like-btn_liked");
      }
    }

    cardLikeBtn.addEventListener("click", (evt) => {
      handleLiked(evt, data._id, cardElement);
    });

    cardImageEl.addEventListener("click", () => {
      openModal(previewModal);
      previewModalImageEl.src = data.link;
      previewModalImageEl.alt = data.name;
      previewModalCaptionEl.textContent = data.name;
    });

    cardDeleteBtn.addEventListener("click", () => {
      selectedCard = cardElement;
      selectedCardId = data._id;
      openModal(deleteModal);
    });

    return cardElement;
  }

  function handleLiked(evt, cardId, cardElement) {
    const cardLikeBtn = cardElement.querySelector(".card__like-btn");

    const isCurrentlyLiked = cardLikeBtn.classList.contains(
      "card__like-btn_liked"
    );

    if (isCurrentlyLiked) {
      cardLikeBtn.classList.remove("card__like-btn_liked");
    } else {
      cardLikeBtn.classList.add("card__like-btn_liked");
    }
    api
      .changeLike(cardId, !isCurrentlyLiked)
      .then((updatedCard) => {
        if (updatedCard && updatedCard.likes) {
          const isNowLiked = updatedCard.likes.some(
            (like) => like._id === currentUserId || like === currentUserId
          );

          if (isNowLiked !== isCurrentlyLiked) {
            if (isNowLiked) {
              cardLikeBtn.classList.add("card__like-btn_liked");
            } else {
              cardLikeBtn.classList.remove("card__like-btn_liked");
            }
          }

          const likeCount = updatedCard.likes.length;
          const likesCountElement =
            cardElement.querySelector(".card__likes-count");
          if (likesCountElement) {
            likesCountElement.textContent = likeCount;
          }
        }
      })
      .catch((error) => {
        console.error("Error updating like status:", error);
        if (isCurrentlyLiked) {
          cardLikeBtn.classList.add("card__like-btn_liked");
        } else {
          cardLikeBtn.classList.remove("card__like-btn_liked");
        }
      });
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

  function handleDeleteModalSubmit(evt) {
    evt.preventDefault();
    api
      .deleteCard(selectedCardId)
      .then(() => {
        if (selectedCard) {
          selectedCard.remove();
        }
        closeModal(deleteModal);
      })
      .catch(console.error);
  }

  function handleEditFormSubmit(evt) {
    evt.preventDefault();
    const submitButton = evt.submitter;
    setButtonText(submitButton, true, "Save", "Saving...");
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
      .catch(console.error)
      .finally(() => {
        setButtonText(submitButton, false, "Save", "Saving...");
      });
  }

  function handleAddCardSubmit(evt) {
    evt.preventDefault();
    const inputValues = {
      name: cardNameInput.value,
      link: cardLinkInput.value,
    };
    api
      .addCard(inputValues)
      .then((newCard) => {
        const cardElement = getCardElement(newCard);
        cardsList.prepend(cardElement);
        evt.target.reset();
        resetValidation(cardForm, validationConfig);
        closeModal(cardModal);
      })
      .catch(console.error);
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
  avatarBtn.addEventListener("click", () => openModal(avatarModal));

  editModalCloseButton.addEventListener("click", () => closeModal(editModal));
  cardModalCloseButton.addEventListener("click", () => closeModal(cardModal));
  avatarModalCloseButton.addEventListener("click", () =>
    closeModal(avatarModal)
  );
  previewModalCloseButton.addEventListener("click", () =>
    closeModal(previewModal)
  );
  deleteModalCloseButton.addEventListener("click", () =>
    closeModal(deleteModal)
  );

  deleteForm.addEventListener("submit", handleDeleteModalSubmit);
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
      currentUserId = user._id;
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
