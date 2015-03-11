
define ([
	"standard/Math/Numbers/Vector3",
],
function (Vector3)
{
	return {
		normal: function (v1, v2, v3)
		{
			return Vector3 .subtract (v3, v2) .cross (Vector3 .subtract (v1, v2)) .normalize ();
		},
		quadNormal: function (v1, v2, v3, v4)
		{
			return Vector3 .subtract (v3, v1) .cross (Vector3 .subtract (v4, v2)) .normalize ();
		},
	};
});
