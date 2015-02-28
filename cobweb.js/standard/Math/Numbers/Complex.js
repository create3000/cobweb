
define (function ()
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
			var complex = new Complex ();
			complex .setPolar (radius, angle);
			return complex;
		},
	});

	Complex .prototype =
	{
		constructor: Complex,
		copy: function ()
		{
			return new Complex (this .real, this .imag);
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
			return new Complex (this .real, -this .imag);
		},
		negate: function ()
		{
			return new Complex (-this .real, -this .imag);
		},
		inverse: function ()
		{
			var d = this .real * this .real + this .imag * this .imag;

			return new Complex (this .real / d, -this .imag / d);
		},
		add: function (value)
		{
			return new Complex (this .real + value .real,
			                    this .imag + value .imag);
		},
		subtract: function (value)
		{
			return new Complex (this .real - value .real,
			                    this .imag - value .imag);
		},
		multiply: function (value)
		{
			return new Complex (this .real * value .real - this .imag * value .imag,
			                    this .real * value .imag + this .imag * value .real);
		},
		divide: function (value)
		{
			var d = value .real * value .real + value .imag * value .imag;

			return new Complex ((this .real * value .real + this .imag * value .imag) / d,
					              (this .imag * value .real - this .real * value .imag) / d);
		},
	};

	return Complex;
});
