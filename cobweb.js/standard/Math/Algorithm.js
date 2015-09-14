

define (function (Vector3)
{
	var destinations = { };

	var Algorithm =
	{
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
			if (destinations [destination .constructor .name])
				destination = destinations [destination .constructor .name] .assign (destination);
			else
				destination = destinations [destination .constructor .name] = destination .copy ();

			var cosom = source .dot (destination);

			if (cosom <= -1)
				throw new Error ("slerp is not possible: vectors are inverse collinear.");

			if (cosom >= 1) // both normal vectors are equal
				return source;

			if (cosom < 0)
			{
				// Reverse signs so we travel the short way round
				cosom = -cosom;
				destination .negate ()
			}				

			var
				omega = Math .acos (cosom),
				sinom = Math .sin  (omega),

				scale0 = Math .sin ((1 - t) * omega),
				scale1 = Math .sin (t * omega);

			return source .multiply (scale0) .add (destination .multiply (scale1)) .divide (sinom);
		},
		isPowerOfTwo: function (n)
		{
			return ((n - 1) & n) === 0;
		},
		nextPowerOfTwo: function (n)
		{
			-- n;

			for (var k = 1; ! (k & (1 << (4 + 1))); k <<= 1)
				n |= n >> k;

			return ++ n;
		},
		/*
		isInt: function(n)
		{
			return typeof n === 'number' && 
			       parseFloat (n) == parseInt (n, 10) && ! isNaN (n);
		},
		decimalPlaces: function (n)
		{
			var
				a = Math.abs(n),
				c = a, count = 1;

			while(! Algorithm .isInt (c) && isFinite (c))
				c = a * Math .pow (10, count ++);
	
			return count-1;
		},
		*/
		less: function (lhs, rhs)
		{
			return lhs < rhs;
		},
		greater: function (lhs, rhs)
		{
			return lhs > rhs;
		},
		lowerBound: function (array, first, last, value, comp)
		{
			var
				index = 0,
				step  = 0,
				count = last - first;

			while (count > 0)
			{
				step  = count >>> 1;
				index = first + step;

				if (comp (array [index], value))
				{
					first  = ++ index;
					count -= step + 1;
				}
				else
					count = step;
			}

			return first;
		},
		upperBound: function (array, first, last, value, comp)
		{
			var
				index = 0,
				step  = 0,
				count = last - first;

			while (count > 0)
			{
				step  = count >>> 1;
				index = first + step;

				if (comp (value, array [index]))
					count = step;

				else
				{
					first  = ++ index;
					count -= step + 1;
				}
			}

			return first;
		},
		set_difference: function (lhs, rhs, result)
		{
			for (var key in lhs)
			{
				if (key in rhs)
					continue;

				result [key] = lhs [key];
			}

			return result;
		},
	};

	Object .preventExtensions (Algorithm);
	Object .freeze (Algorithm);
	Object .seal (Algorithm);

	return Algorithm;
});
