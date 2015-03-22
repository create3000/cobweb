
define ([
	"standard/Math/Numbers/Matrix4",
],
function (Matrix4)
{
	return {
		frustum: function (l, r, b, t, n, f)
		{
			var
				r_l = r - l,
				t_b = t - b,
				f_n = f - n,
				n_2 = 2 * n,

				A = (r + l) / r_l,
				B = (t + b) / t_b,
				C = -(f + n) / f_n,
				D = -n_2 * f / f_n,
				E = n_2 / r_l,
				F = n_2 / t_b;

			return new Matrix4 (E, 0, 0, 0,
			                    0, F, 0, 0,
			                    A, B, C, -1,
			                    0, 0, D, 0);
		},
		perspective: function (fieldOfView, zNear, zFar, viewport)
		{
			var
				width  = viewport [2],
				height = viewport [3],
				ratio  = Math .tan (fieldOfView / 2) * zNear;

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
			var
				r_l = r - l,
				t_b = t - b,
				f_n = f - n,

				A =  2 / r_l,
				B =  2 / t_b,
				C = -2 / f_n,
				D = -(r + l) / r_l,
				E = -(t + b) / t_b,
				F = -(f + n) / f_n;

			return new Matrix4 (A, 0, 0, 0,
			                    0, B, 0, 0,
			                    0, 0, C, 0,
			                    D, E, F, 1);
		},
	};
});
