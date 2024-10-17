# @vegajs/modal-controller

[![npm version](https://badge.fury.io/js/%40vegajs%2Fmodal-controller.svg)](https://badge.fury.io/js/%40vegajs%2Fmodal-controller)

- [Introduction](#introduction)
- [ModalContainer](#modalcontainer)
    - [Props](#props)
    - [Usage](#usage)
- [ModalProvider](#modalprovider)
    - [Usage](#usage-1)
- [ModalController](#modalcontroller)
    - [API Overview](#api-overview)
    - [Methods](#methods)
    - [Examples](#examples)
- [Advanced Usage](#advanced-usage)

# Introduction

This documentation is intended to provide a comprehensive guide to the `ModalContainer`, `ModalProvider`, and `ModalController` components. These components form a system for managing modal windows in your application, offering a flexible, extensible, and intuitive API for both simple and advanced modal workflows.

## Installation

Install the package via npm:

```bash
npm install @vegajs/storage
```

# ModalContainer

`ModalContainer` is a wrapper component that is responsible for rendering the currently active modal window on the page. It listens to the `ModalController` to determine which modal to display.

## Props

- **controller**: *(Required)* An instance of `ModalController` that manages the modal windows. This prop determines which modal is currently active and handles its lifecycle.
- **BackdropComponent**: *(Optional)* A component that wraps around the modal content to create a backdrop effect. If not provided, the modal content will be displayed without a backdrop.

## Usage

```typescript jsx
import { modalController, ModalContainer } from '@vegajs/modal-controller';

export const App = () => (
  <div>
    <ModalContainer controller={modalController} />
    <ModalShow />
  </div>
);
```

In this example, `ModalContainer` listens to the `modalController` to determine which modal to render. You can also provide a custom `BackdropComponent` for added visual effects.

# ModalProvider

`ModalProvider` is a wrapper component that provides modal management via React context. It works with the `useModal` hook, allowing you to easily manage modals without explicitly passing a controller.

## Usage

```typescript jsx
import { ModalProvider } from '@vegajs/modal-controller';

export const App = () => (
  <div>
    <ModalProvider>
      <ModalShowWithContext />
    </ModalProvider>
  </div>
);
```

With `ModalProvider`, any nested component can use the `useModal` hook to show or hide modals without direct access to a modal controller instance.

# ModalController

`ModalController` is a class responsible for managing the entire lifecycle of modal windows. It provides a rich set of methods for displaying, hiding, and confirming modals.

## API Overview

The `ModalController` API provides the following core methods:

- `show`: Displays a new modal.
- `onClose`: Closes the current modal.
- `onResolve`: Completes the current modal with a result.
- `subscribe`: Listens for changes to the current modal.
- `closeAll`: Closes all active modals.

## Methods

### `subscribe(listener: Listener<ModalUnit | null>): () => void`

Subscribes to changes in the currently active modal and notifies listeners when the active modal changes.

**Parameters**:
- `listener`: A function that receives the current modal state (`ModalUnit | null`).

**Returns**:
- A function to unsubscribe from the current modal state.

### `show(modal: ModalUnit): EventEmitter<ResolveObject<T>>`

Displays a new modal. If the modal is already in the queue, it will be moved to the top.

**Parameters**:
- `modal`: The modal data to be displayed.

**Returns**:
- An `EventEmitter` that can be used to subscribe to the resolution of the modal.

**Example**:
```typescript
const modal = modalController.show(myModalData);
modal.subscribe(({ status }) => console.log(status));
```

### `onClose(): void`

Closes the currently active modal. If the modal has a confirmation step, it will display the confirmation modal instead.

**Example**:
```typescript
<button onClick={controller.onClose}>Close Modal</button>
```

### `onResolve(status: boolean, data?: T): void`

Completes the current modal by providing the result of its execution. If `status` is `true`, the modal will be closed.

**Parameters**:
- `status`: A boolean indicating whether the modal was successfully completed.
- `data`: Optional data to pass to the subscribers of the modal.

**Example**:
```typescript
<button onClick={() => controller.onResolve(true)}>Confirm</button>
<button onClick={() => controller.onResolve(false)}>Cancel</button>
```

### `closeAll(): void`

Closes all active modals and unsubscribes any listeners.

**Example**:
```typescript
controller.closeAll();
```

## Examples

### Displaying a Basic Modal

Using `modalController`:
```typescript
modalController.show({ id: 'baseModal', component: BaseModal });
```

Using `useModal`:
```typescript jsx
import { useModal } from '@vegajs/modal-controller';

const Component = () => {
  const { show } = useModal();
  const handleShowModal = () => {
    show({ id: 'baseModal', component: BaseModal });
  };
  return <button onClick={handleShowModal}>Show Modal</button>;
};
```

### Displaying a Modal with Confirmation
```typescript
const handleShowBaseWithConfirm = () => {
  modalController
    .show({
      id: 'baseModalWithConfirm',
      component: BaseModal,
      confirmComponent: ConfirmModal,
    })
    .subscribe(({ status }) => {
      console.log(`Modal closed with status: ${status}`);
    });
};
```

### Displaying a Modal with an Inner Modal

**Base Modal**:
```typescript jsx
const handleShowModalWithInnerModal = () => {
  modalController
    .show({
      id: 'withInnerModal',
      component: (props) => {
        const handlerShowInner = () => {
          modalController
            .show({
              id: 'innerModal',
              component: InnerModal,
            })
            .subscribe(({ status }) => {
              console.log(`Modal closed with status: ${status}`);
            });
        };

        return (
          <BaseModal {...props}>
            <button onClick={handlerShowInner}>Show Inner Modal</button>
          </BaseModal>
        );
      },
    })
    .subscribe(({ status }) => {
      console.log(`Modal closed with status: ${status}`);
    });
};
```

# Advanced Usage

## Nested Modals

You can use the `ModalController` to manage nested modals by calling `show` inside a modal's component. This allows you to create complex workflows, such as step-by-step wizards or confirmation dialogs within modals.

## Handling Modal Completion

Use the `onResolve` method to handle the result of a modal. This can be useful for confirmation dialogs, where the user must either confirm or cancel an action.

**Example**:
```typescript jsx
const handleConfirm = () => {
  modalController.show({
    id: 'confirmDelete',
    component: ConfirmDeleteModal,
  }).subscribe(({ status }) => {
    if (status) {
      // Perform the delete action
    }
  });
};
```

# Conclusion

The `ModalContainer`, `ModalProvider`, and `ModalController` components provide a powerful system for managing modals in your application. By combining these components, you can create a variety of modal workflows, from simple alerts to complex multi-step wizards. The rich API of `ModalController` allows you to customize and extend modal behaviors to suit your application's needs.

