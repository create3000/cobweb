
define ([
	"standard/Math/Numbers/Matrix4",
],
function (Matrix4)
{
	return {
		frustum: function (l, r, b, t, n, f)
		{
			var r_l = r - l;
			var t_b = t - b;
			var f_n = f - n;
			var n_2 = 2 * n;

			var A = (r + l) / r_l;
			var B = (t + b) / t_b;
			var C = -(f + n) / f_n;
			var D = -n_2 * f / f_n;
			var E = n_2 / r_l;
			var F = n_2 / t_b;

			return new Matrix4 (E, 0, 0, 0,
			                    0, F, 0, 0,
			                    A, B, C, -1,
			                    0, 0, D, 0);
		},
		perspective: function (fieldOfView, zNear, zFar, viewport)
		{
			var width  = viewport [2];
			var height = viewport [3];
			var ratio  = Math .tan (fieldOfView / 2) * zNear;

			if (width > height)
			{
				var aspect = width * ratio / height;
				return this .frustum (-aspect, aspect, -ratio, ratio, zNear, zFar);
			}
			else
			{
				var aspect = height * ratio / width;
				return this .frustum (-ratio, ratio, -aspect, aspect, zNear, zFar);
			}
		},
		ortho: function (l, r, b, t, n, f)
		{
			var r_l = r - l;
			var t_b = t - b;
			var f_n = f - n;

			var A =  2 / r_l;
			var B =  2 / t_b;
			var C = -2 / f_n;
			var D = -(r + l) / r_l;
			var E = -(t + b) / t_b;
			var F = -(f + n) / f_n;

			return new Matrix4 (A, 0, 0, 0,
			                    0, B, 0, 0,
			                    0, 0, C, 0,
			                    D, E, F, 1);
		},
	};
});
