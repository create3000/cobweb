
define ([
	"jquery",
],
function ($)
{
	function Complex (real, imag)
	{
		switch (arguments .length)
		{
			case 0:
				this .real = 0;
				this .imag = 0;
				return this;
			case 1:
				this .real = real;
				this .imag = 0;
				return this;
			default:
				this .real = real
				this .imag = imag;
				return this;
		}
	}

	$.extend (Complex,
	{
		Polar: function (radius, angle)
		{
			var complex = Object .create (Complex .prototype);
			complex .real = radius * Math .cos (angle);
			complex .imag = radius * Math .sin (angle);
			return complex;
		},
	});

	Complex .prototype =
	{
		constructor: Complex,
		copy: function ()
		{
			var copy = Object .create (Complex .prototype);
			copy .real = this .real;
			copy .imag = this .imag;
			return copy;
		},
		assign: function (complex)
		{
			this .real = complex .real;
			this .imag = complex .imag;
			return this;
		},
		equals: function (complex)
		{
			return this .real === complex .real &&
			       this .imag === complex .imag;
		},
		setRadius: function (radius)
		{
			return this .setPolar (radius, this .getAngle ());
		},
		getRadius: function ()
		{
			if (this .real)
			{
				if (this .imag)
					return Math .sqrt (this .real * this .real + this .imag * this .imag);

				return Math .abs (this .real);
			}

			return Math .abs (this .imag);
		},
		setAngle: function (angle)
		{
			return this .setPolar (this .getRadius (), angle);
		},
		getAngle: function ()
		{
			return Math .atan2 (this .imag, this .real);
		},
		setPolar: function (radius, angle)
		{
			this .real = radius * Math .cos (angle);
			this .imag = radius * Math .sin (angle);
		},
		conjugate: function ()
		{
			this .imag = -this .imag;
			return this;
		},
		negate: function ()
		{
			this .real = -this .real;
			this .imag = -this .imag;
			return this;
		},
		inverse: function ()
		{
			var d = this .real * this .real + this .imag * this .imag;

			this .real /=  d;
			this .imag /= -d;
			return this;
		},
		add: function (value)
		{
			this .real += value .real;
			this .imag += value .imag;
			return this;
		},
		subtract: function (value)
		{
			this .real -= value .real;
			this .imag -= value .imag;
			return this;
		},
		multiply: function (value)
		{
			if (value instanceof Complex)
			{
				var
					real = this .real, imag = this .imag;
	
				this .real = real * value .real - imag * value .imag;
				this .imag = real * value .imag + imag * value .real;
				return this;
			}

			this .real *= value;
			this .imag *= value;
			return this;
		},
		divide: function (value)
		{
			var
				ar = this .real, ai = this .imag,
				br = value .real, bi = value .imag;
		
			var d = br * br + bi * bi;

			this .real = (ar * br + ai * bi) / d;
			this .imag = (ai * br - ar * bi) / d;
			return this;
		},
		toString: function ()
		{
			if (this .imag)
				return this .real + " " + this .imag + "i";

			return String (this .real);
		},
	};

	return Complex;
});
