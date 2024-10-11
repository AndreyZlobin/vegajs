import { computed, signal } from '../external';
import { Status } from './enums';

export class StatusFactory<TError = unknown> {
  public status = signal<Status>(Status.IDLE);

  /**
   * Data of the last error
   */
  public error = signal<TError | null>(null);

  /**
   * Flag indicating that the last request failed
   */
  public isError = computed(
    () => this.status.value === Status.ERROR || Boolean(this.error.value),
  );

  /**
   * Flag indicating that the data is in idle state
   */
  public isIdle = computed(() => this.status.value === Status.IDLE);

  /**
   * Flag indicating the success of the last request
   */
  public isSuccess = computed(() => this.status.value === Status.SUCCESS);

  /**
   * Flag indicating that data is being loaded
   */
  public isLoading = computed(() => this.status.value === Status.LOADING);

  public setStatus(status: Status) {
    this.status.value = status;
  }

  public setError(error: TError | null) {
    this.error.value = error;
  }
}
