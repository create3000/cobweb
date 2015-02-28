
define (function ()
{
	return {
		normal: function (v1, v2, v3)
		{
			return v3 .subtract (v2) .cross (v1 .subtract (v2)) .normalize ();
		},
		quadNormal: function (v1, v2, v3, v4)
		{
			return v3 .subtract (v1) .cross (v4 .subtract (v2)) .normalize ();
		},
	};
});
