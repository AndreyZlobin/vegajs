import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ModalComponent } from '../types';
import { createConfirmId } from '../utils';
import { ModalController } from './modal-controller';

const mockComponent = 'component' as unknown as ModalComponent;

describe('ModalController', () => {
  let modalController: ModalController;

  beforeEach(() => {
    modalController = new ModalController();
  });

  it('should return null on the first subscription to modalController.subscribe', () => {
    const unsubscribe = modalController.subscribe((modal) => {
      expect(modal).toEqual(null);
    });

    unsubscribe();
  });

  it('should add a newly opened modal to the subscription', () => {
    const modalData = { id: 'test1', component: mockComponent };

    const unsubscribe = modalController.subscribe((modal) => {
      expect(modal?.id).toEqual(modalData.id);
    });

    modalController.show(modalData);
    unsubscribe();
  });

  it('should return null after closing the newly opened modal', () => {
    const modalData = { id: 'test1', component: mockComponent };

    const listener = vi.fn();

    const unsubscribe = modalController.subscribe(listener);

    modalController.show(modalData);
    //modalController.current doesn't matter
    expect(listener).toHaveBeenCalledWith(modalController.current);
    modalController.onClose();
    expect(listener).toHaveBeenCalledWith(null);
    unsubscribe();
  });

  it('should show a modal window', () => {
    const modalData = { id: 'test1', component: mockComponent };

    modalController.show(modalData);
    expect(modalController.current.id).toEqual(modalData.id);
  });

  it('should close the modal window', () => {
    const modalData = { id: 'test1', component: mockComponent };

    modalController.show(modalData);
    modalController.onClose();
    expect(modalController.current).toBeUndefined();
  });

  it('should show the confirm modal window', () => {
    const modalData = {
      id: 'test1',
      component: mockComponent,
      confirmComponent: mockComponent,
    };

    modalController.show(modalData);
    modalController.onClose();
    expect(modalController.current.id).toEqual(createConfirmId(modalData.id));
  });

  it('should resolve the modal window with a positive result', () => {
    const modalData = { id: 'test1', component: mockComponent };
    const emitter = modalController.show(modalData);

    const mockSubscriber = vi.fn();

    emitter.subscribe(mockSubscriber);

    const resultData = { message: 'Confirmed' };

    modalController.onResolve(true, resultData);

    expect(mockSubscriber).toHaveBeenCalledWith({
      status: true,
      data: resultData,
    });

    expect(modalController.current).toBeUndefined();
  });

  it('should resolve the modal window with a negative result', () => {
    const modalData = { id: 'test1', component: mockComponent };
    const emitter = modalController.show(modalData);

    const mockSubscriber = vi.fn();

    emitter.subscribe(mockSubscriber);
    modalController.onResolve(false);

    expect(mockSubscriber).toHaveBeenCalledWith({
      status: false,
      data: undefined,
    });

    expect(modalController.current.id).toEqual(modalData.id);
  });

  it('should close all modal windows', () => {
    modalController.show({ id: 'test1', component: mockComponent });
    modalController.show({ id: 'test2', component: mockComponent });
    modalController.show({ id: 'test3', component: mockComponent });
    modalController.closeAll();
    expect(modalController.current).toBeUndefined();
  });

  it('should properly manage the modal queue', () => {
    const modalData1 = { id: 'test1', component: mockComponent };
    const modalData2 = { id: 'test2', component: mockComponent };

    modalController.show(modalData1);
    modalController.show(modalData2);
    expect(modalController.current.id).toEqual(modalData2.id);
    modalController.onClose();
    expect(modalController.current.id).toEqual(modalData1.id);
  });

  it('should handle confirm modal and close it when onResolve is called with true', () => {
    const modalData = {
      id: 'test1',
      component: mockComponent,
      confirmComponent: 'ConfirmComponent1',
    };

    modalController.show(modalData);
    modalController.onClose();
    expect(modalController.current.id).toEqual(createConfirmId(modalData.id));
    modalController.onResolve(true);
    expect(modalController.current).toBeUndefined();
  });

  it('should handle confirm modal and revert it when onResolve is called with false', () => {
    const modalData = {
      id: 'test1',
      component: mockComponent,
      confirmComponent: 'ConfirmComponent1',
    };

    modalController.show(modalData);
    modalController.onClose();
    expect(modalController.current.id).toEqual(createConfirmId(modalData.id));
    modalController.onResolve(false);
    expect(modalController.current.id).toEqual(modalData.id);
  });

  it('onResolve should work without subscribers', () => {
    const modalData = { id: 'test1', component: mockComponent };

    modalController.show(modalData);
    expect(() => modalController.onResolve(true)).not.toThrow();
  });

  it('closeLastListener should properly handle the last subscriber', () => {
    const modalData = { id: 'test1', component: mockComponent };
    const emitter = modalController.show(modalData);
    const mockSubscriber = vi.fn();

    emitter.subscribe(mockSubscriber);
    modalController.onClose();
    expect(mockSubscriber).not.toHaveBeenCalled();
  });

  it('should not show confirm modal if confirmComponent is not provided', () => {
    const modalData = { id: 'test1', component: mockComponent };

    modalController.show(modalData);
    modalController.onClose();
    expect(modalController.current).toBeUndefined();
  });

  it('closeAll should close all modal windows, including confirm modals', () => {
    const modalData = {
      id: 'test1',
      component: mockComponent,
      confirmComponent: 'ConfirmComponent1',
    };

    modalController.show(modalData);
    modalController.onClose();
    modalController.closeAll();
    expect(modalController.current).toBeUndefined();
  });

  it('onResolve with status false should not close the modal window', () => {
    const modalData = { id: 'test1', component: mockComponent };

    modalController.show(modalData);
    modalController.onResolve(false);
    expect(modalController.current.id).toEqual(modalData.id);
  });

  it('all subscribers should receive notifications', () => {
    const modalData = { id: 'test1', component: mockComponent };
    const emitter = modalController.show(modalData);

    const mockSubscriber1 = vi.fn();
    const mockSubscriber2 = vi.fn();

    emitter.subscribe(mockSubscriber1);
    emitter.subscribe(mockSubscriber2);

    const resultData = { message: 'Hello' };

    modalController.onResolve(true, resultData);

    expect(mockSubscriber1).toHaveBeenCalledWith({
      status: true,
      data: resultData,
    });

    expect(mockSubscriber2).toHaveBeenCalledWith({
      status: true,
      data: resultData,
    });
  });

  it('reopening the same modal should work correctly', () => {
    const modalData = { id: 'test1', component: mockComponent };

    modalController.show(modalData);
    modalController.onClose();
    modalController.show(modalData);
    expect(modalController.current.id).toEqual(modalData.id);
  });

  it('closing a modal with an empty queue should not throw errors', () => {
    expect(() => modalController.onClose()).not.toThrow();
  });

  it('onResolve with an empty queue should not throw errors', () => {
    expect(() => modalController.onResolve(true)).not.toThrow();
  });
});
