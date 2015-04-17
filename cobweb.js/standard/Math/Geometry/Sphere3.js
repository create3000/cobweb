
define ([
	"standard/Math/Numbers/Vector3",
],
function (Vector3)
{
	function Sphere3 (radius, center)
	{
		this .radius = radius;
		this .center = center .copy ();
	}

	Sphere3 .prototype =
	{
		constructor: Sphere3,
		intersectsLine: function (line, intersection1, intersection2)
		{
			var
				L   = Vector3 .subtract (this .center, line .point),
				tca = Vector3 .dot (L, line .direction);

			if (tca < 0)
				// there is no intersection
				return false;

			var
				d2 = Vector3 .dot (L, L) -Math .pow (tca, 2),
				r2 = Math .pow (this .radius, 2);

			if (d2 > r2)
				return false;

			var thc = Math .sqrt (r2 - d2);

			var
				t1 = tca - thc,
				t2 = tca + thc;

			intersection1 .assign (line .direction) .multiply (t1) .add (line .point);
			intersection2 .assign (line .direction) .multiply (t2) .add (line .point);

			return true;
		},
		toString: function ()
		{
			return this .radius + " " + this .center .toString ();
		},
	};

	return Sphere3;
});
