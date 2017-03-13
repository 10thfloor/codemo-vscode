class RecentlyClosed {

	public closed: string[]
	private max: number;

	constructor() {
		this.closed = [];
		this.max = 5;
	}

	public add(streamName) {
		if(this.closed.length === this.max) {
			this.closed.pop();
			this.closed.push(streamName);
		} else {
			this.closed.push(streamName);
		}
		return true;
	}

	public check(streamName) {
		return this.closed.find(streamName);
	}

	public all() {
		return this.closed;
	}
}

export default new RecentlyClosed();