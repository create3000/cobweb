
define ([
	"standard/Math/Numbers/Vector3",
],
function (Vector3)
{
	function Plane3 (point, normal)
	{
		this .normal             = normal;
		this .distanceFromOrigin = normal .dot (point);
	}

	Plane3 .prototype =
	{
		distance: function (point)
		{
			return point .dot (this .normal) - this .distanceFromOrigin;
		},
	};

	return Plane3;
});
