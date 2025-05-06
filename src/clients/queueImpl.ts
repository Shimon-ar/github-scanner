export class QueueImpl<T> {
    private queue: T[] = [];
    enqueue(item: T) { this.queue.push(item); }
    dequeue(): T | undefined { return this.queue.shift(); }
    isEmpty(): boolean { return this.queue.length === 0; }
    size(): number { return this.queue.length; }
}
