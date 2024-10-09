import { EventEmitter } from '../event-emitter';
import type { ModalUnit, ResolveObject, ServiceModalUnit } from '../types';
import { createConfirmId, isConfirmModalUnit, isModalUnit } from '../utils';

type Listener<T> = (state: T) => void;

/**
 * Controller for managing modals
 */
export class ModalController {
  private queue: ServiceModalUnit[] = [];

  private modalEmitter = new EventEmitter<ResolveObject<unknown>>();

  private currentEmitter = new EventEmitter<ModalUnit | null>();

  /**
   * Method to notify about the current modal state
   * */
  private notify(unit: ModalUnit | null) {
    this.currentEmitter.emit(unit);
  }

  /**
   * Method to subscribe to the current modal state
   * */
  public subscribe(listener: Listener<ModalUnit | null>): () => void {
    const subscription = this.currentEmitter.subscribe(listener);

    if (this.current) {
      listener(this.current || null);
    }

    return subscription;
  }

  private get isConfirm() {
    return isConfirmModalUnit(this.current);
  }

  private showConfirm() {
    const currentModal = this.current;

    if (isModalUnit(currentModal) && currentModal.confirmComponent) {
      const confirmModal = {
        id: createConfirmId(currentModal.id),
        component: currentModal.confirmComponent,
      };

      return this.show(confirmModal);
    }

    return;
  }

  private closeConfirm() {
    this.queue.pop();
    this.notify(this.queue.at(-1) || null);
  }

  private closeLastListener = () => {
    const listener = this.modalEmitter.listeners.at(-1);

    this.modalEmitter.unsubscribe(listener!);
  };

  /**
   * Get the current modal window from the queue.
   * @returns {ServiceModalUnit} The current modal window.
   */
  public get current(): ServiceModalUnit {
    return this.queue[this.queue.length - 1]!;
  }

  /**
   * Method for getting the current modal window from the queue.
   * @returns {ServiceModalUnit} The current modal window.
   */
  public getCurrent = (): ServiceModalUnit => {
    return this.current;
  };

  /**
   * Show a modal window.
   * @param {ModalUnit} modal - Modal window data to be displayed.
   * @returns {EventEmitter<ResolveObject<T>>} Instance of EventEmitter.
   * @example
   * const modal = modalService.show(myModalData);
   * modal.subscribe(({ status }) => console.log(status));
   */
  public show<T = unknown>(
    modal: ModalUnit,
  ): Omit<EventEmitter<ResolveObject<T>>, 'listeners' | 'emit'> {
    const duplicateModal = this.queue.find(({ id }) => modal.id === id);

    if (duplicateModal) {
      /*
       * It is necessary to remove duplicate modals with an unknown index and move them to the last index in the queue
       * */
      this.queue = this.queue.filter(({ id }) => id !== duplicateModal.id);
      this.queue.push(duplicateModal);
      this.notify(duplicateModal);

      return this.modalEmitter as EventEmitter<ResolveObject<T>>;
    }

    const newModal: ServiceModalUnit = {
      ...modal,
      onResolve: this.onResolve,
    };

    this.queue.push(newModal);
    this.notify(newModal);

    return this.modalEmitter as Omit<
      EventEmitter<ResolveObject<T>>,
      'listeners' | 'emit'
    >;
  }

  /**
   * Closes the active modal window
   * @returns void
   */
  public onClose = () => {
    const currentModal = this.current;

    if (!currentModal) {
      return;
    }

    if (isModalUnit(currentModal) && currentModal.confirmComponent) {
      this.showConfirm();

      return;
    }

    if (this.isConfirm) {
      this.closeConfirm();

      return;
    }

    const hasListeners = this.modalEmitter.listeners.length > 0;

    if (hasListeners) {
      this.closeLastListener();
    }

    this.queue.pop();
    this.notify(null);
  };

  /**
   * Completes the current modal window by providing the result of its execution.
   * If the modal window has subscribers, it notifies them of the result.
   * If the status is `true`, the modal window will be closed.
   *
   * @param {boolean} status - The completion status of the modal window. If `true`, the window will be closed.
   * @param {T} [data] - Optional data to pass to the subscribers of the modal window.
   * @example
   *
   * // Complete the modal window with a positive result without data
   * <button onClick={() => onResolve(true)}>Yes</button>
   *
   * // Complete the modal window with a positive result with data
   * <button onClick={() => onResolve(true, {user: {age: 91}})}>Yes</button>
   *
   * // Complete the modal window with a negative result without data
   * <button onClick={() => onResolve(false)}>No</button>
   *
   * // Complete the modal window with a negative result with data
   * <button onClick={() => onResolve(false, {user: {age: 91}})}>No</button>
   *
   */
  public onResolve = <T>(status: boolean, data?: T) => {
    const hasListeners = this.modalEmitter.listeners.length > 0;

    if (hasListeners) {
      this.modalEmitter.emit({ status, data });
    }

    if (status && hasListeners) {
      this.closeLastListener();
    }

    if (this.isConfirm) {
      this.closeConfirm();
    }

    if (status) {
      this.queue.pop();
      this.notify(this.queue.at(-1) || null);
    }
  };

  /**
   * Close all active modal windows
   * @returns void
   */
  public closeAll() {
    this.queue = [];
    this.notify(null);

    this.modalEmitter.listeners.forEach((l) => {
      this.modalEmitter.unsubscribe(l);
    });

    this.currentEmitter.listeners.forEach((l) => {
      this.currentEmitter.unsubscribe(l);
    });
  }
}
