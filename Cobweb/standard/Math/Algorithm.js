

define (function ()
{
	return {
		radians: function (value)
		{
			return value * (Math .PI / 180);
		},
		degrees: function (value)
		{
			return value * (180 / Math .PI);
		},
		clamp: function (value, min, max)
		{
			return value < min ? min : (value > max ? max : value);
		},
		interval: function (value, low, high)
		{
			if (value >= high)
				return ((value - low) % (high - low)) + low;

			if (value < low)
				return ((value - high) % (high - low)) + high;

			return value;
		},
		lerp: function (source, destination, t)
		{
			return source + t * (destination - source);
		},
		slerp: function (source, destination, t)
		{
			var cosom = source .dot (destination);

			if (cosom <= -1)
				throw new Error ("slerp is not possible: vectors are inverse collinear.");

			if (cosom >= 1) // both normal vectors are equal
				return source;

			if (cosom < 0)
			{
				// Reverse signs so we travel the short way round
				cosom       = -cosom;
				destination = destination .negate ()
			}

			var omega = Math .acos (cosom);
			var sinom = Math .sin  (omega);

			var scale0 = Math .sin ((1 - t) * omega);
			var scale1 = Math .sin (t * omega);

			return source .multiply (scale0) .add (destination .multiply (scale1)) .divide (sinom);
		},
	};
});
