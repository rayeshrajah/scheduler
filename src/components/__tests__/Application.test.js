import React from "react";
import axios from "axios";
import { render, 
         cleanup, 
         waitForElement, 
         fireEvent, 
         prettyDOM, 
         getByText, 
         getByAltText, 
         getByPlaceholderText, 
         getAllByTestId, 
         queryByText, 
         queryByAltText,
         getByDisplayValue,
         wait
        } from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup)

describe("Applicaation", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"))
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for the first day by 1", async () => {
    const {container} = render(<Application />);
    await waitForElement (() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    fireEvent.click(queryByText(appointment, "Confirm"))
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"));
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
    
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday", async () => {
    const { container } = render (<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, 'Edit'));
    expect(getByDisplayValue(appointment, "Archie Cohen"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: {value: 'Rayesh'}
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, 'SAVING')).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, 'Rayesh'));
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render (<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, 'Edit'));
    expect(getByDisplayValue(appointment, "Archie Cohen"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: {value: 'Rayesh'}
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, 'SAVING')).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Error could not save!"));
    expect(getByText(appointment, "Error could not save!")).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const {container} = render(<Application />);
    await waitForElement (() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    fireEvent.click(queryByText(appointment, "Confirm"))
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();
    await waitForElement( () => getByText(appointment, "Error could not delete!"));
    expect(getByText(appointment, "Error could not delete!")).toBeInTheDocument();
  })
});
