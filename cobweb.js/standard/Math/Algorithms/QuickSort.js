
define (function ()
{
	function QuickSort (array, compare)
	{
		this .array = array;
		
		if (compare)
			this .compare = compare;
	}

	QuickSort .prototype =
	{
		compare: function (lhs, rhs)
		{
			return lhs < rhs;
		},
		sort: function (first, last)
		{
			if (last - first > 1)
				this .quicksort (first, last - 1);
		},
		quicksort: function (lo, hi)
		{
			var
				i = lo,
				j = hi,
				array   = this .array,
				compare = this .compare;

			// Vergleichs­element x
			var x = array [(lo + hi) >>> 1];

			for (;;)
			{
				while (compare (array [i], x)) ++ i;
				while (compare (x, array [j])) -- j;

				if (i < j)
				{
					// Exchange
					
					var t = array [i];
					array [i] = array [j];
					array [j] = t;

					i ++; j --;
				}
				else
				{
					if (i === j) ++ i, -- j;
					break;
				}
			}

			// Rekursion
			if (lo < j) this .quicksort (lo, j);
			if (i < hi) this .quicksort (i, hi);
		},
	};

	return QuickSort;
});
