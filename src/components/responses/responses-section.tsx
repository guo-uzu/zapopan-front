"use client";
import { useResponsesSection } from "@/hooks/responses/useResponsesSection";
import { ResponsesSearchBar } from "./responses-search-bar";
import { ResponseFormSheet } from "./response-form-sheet";
import { ResponsesAreaSelectors } from "./responses-area-selectors";
import { ResponsesCardContainer } from "./responses-cards-container";
import { ResponsesFiltered } from "./reponses-filtered";
import { ResponseCard } from "./response-card";
import { CleanFilters } from "./response-clean-filters";
import { useResponsesFetch } from "@/hooks/responses/useReponsesFetch";

export const ResponsesSection = () => {
  const {
    searchTerm,
    handleSearchTerm,
    upperMenu,
    setUpperMenu,
    handleTagClick,
    responses,
    isFetchingResponses,
    isSearching,
  } = useResponsesFetch();

  const {
    openSheet,
    setOpenSheet,
    handleReset,
    isEditing,
    handleFormSubmit,
    formDefaultData,
    setFormDefaultData,
    handleViewDialog,
    openDialog,
    selectedResponse,
    setOpenDialog,
    handleEditRespuesta,
    handleDeleteRespuesta,
  } = useResponsesSection();

  return (
    <div className="px-4 pb-10">
      <div className="max-w-xl w-full mx-auto flex flex-col gap-4 mb-8">
        <ResponsesSearchBar
          searchTerm={searchTerm}
          handleSearchTerm={handleSearchTerm}
        />
        <ResponseFormSheet
          formDefaultData={formDefaultData}
          handleFormSubmit={handleFormSubmit}
          handleReset={handleReset}
          isEditing={isEditing}
          openSheet={openSheet}
          setFormDefaultData={setFormDefaultData}
          setOpenSheet={setOpenSheet}
        />
      </div>
      <ResponsesAreaSelectors
        debouncedText={searchTerm}
        handleTagClick={handleTagClick}
        upperMenu={upperMenu}
      />
      <ResponsesCardContainer
        setUpperMenu={setUpperMenu}
        handleTagClick={handleTagClick}
        upperMenu={upperMenu}
      />
      <ResponsesFiltered
        handleViewDialog={handleViewDialog}
        responses={responses}
        handleTagClick={handleTagClick}
        upperMenu={upperMenu}
        isSearching={isSearching}
        isFetchingResponses={isFetchingResponses}
      />
      <ResponseCard
        handleTagClick={handleTagClick}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedResponse={selectedResponse}
        handleDeleteRespuesta={handleDeleteRespuesta}
        handleEditRespuesta={handleEditRespuesta}
      />
      <CleanFilters
        responses={responses}
        searchTerm={searchTerm}
        handleSearchTerm={handleSearchTerm}
      />
    </div>
  );
};
