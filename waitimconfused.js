class Rect {
	pos = {
		x: 0,
		y: 0,
		w: 1,
		h: 1
	};

	getBoundingRect() {
		return {
			topLeft: {
				x: Math.min(this.pos.x, this.pos.x+this.pos.w),
				y: Math.min(this.pos.y, this.pos.y+this.pos.h)
			},
			topRight: {
				x: Math.max(this.pos.x, this.pos.x+this.pos.w),
				y: Math.min(this.pos.y, this.pos.y+this.pos.h)
			},
			bottomLeft: {
				x: Math.min(this.pos.x, this.pos.x+this.pos.w),
				y: Math.max(this.pos.y, this.pos.y+this.pos.h)
			},
			bottomRight: {
				x: Math.max(this.pos.x, this.pos.x+this.pos.w),
				y: Math.max(this.pos.y, this.pos.y+this.pos.h)
			},
		}
	}

	getMinMax() {
		return {
			x: this.pos.x,
			y: this.pos.y,
			minX: Math.min(this.pos.x, this.pos.x+this.pos.w),
			maxX: Math.max(this.pos.x, this.pos.x+this.pos.w),
			minY: Math.min(this.pos.y, this.pos.y+this.pos.h),
			maxY: Math.max(this.pos.y, this.pos.y+this.pos.h),
		}
	}

	constructor(x=0, y=0, w=1, h=1) {
		this.pos.x = x;
		this.pos.y = y;
		this.pos.w = w;
		this.pos.h = h;
	}

	moveTo(x=0, y=0) {
		this.pos.x = x;
		this.pos.y = y;
	}
	setSize(w=0, h=0) {
		this.pos.w = w;
		this.pos.h = h;
	}

	/**
	 * @param { Rect } rect
	 */
	intersecting(rect) {
		let A = rect.getMinMax();
		let B = this.getMinMax();

		let Ax1 = isInRange( B.minX, A.minX, B.maxX );
		let Ax2 = isInRange( B.minX, A.maxX, B.maxX );
		let Ay1 = isInRange( B.minY, A.minY, B.maxY );
		let Ay2 = isInRange( B.minY, A.maxY, B.maxY );
		let Ax = Ax1 || Ax2;
		let Ay = Ay1 || Ay2;

		let Bx1 = isInRange( A.minX, B.minX, A.maxX );
		let Bx2 = isInRange( A.minX, B.maxX, A.maxX );
		let By1 = isInRange( A.minY, B.minY, A.maxY );
		let By2 = isInRange( A.minY, B.maxY, A.maxY );
		let Bx = Bx1 || Bx2;
		let By = By1 || By2;

		let I1 = Ax && Ay;
		let I2 = Bx && By;
		let I3 = (Ax && By) || (Ay && Bx);
		
		return I1 || I2 || I3;
	}
}

function isInRange(min=0, value=0.5, max=1) {
	return value >= min && value <= max;
}

var rect1 = new Rect()