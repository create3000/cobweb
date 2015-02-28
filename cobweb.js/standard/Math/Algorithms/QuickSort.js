
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
			var i = lo, j = hi;

			// Vergleichs­element x
			var x = this .array [(lo + hi) >>> 1];

			for (;;)
			{
				while (this .compare (this .array [i], x)) ++ i;
				while (this .compare (x, this .array [j])) -- j;

				if (i < j)
					this .exchange (i ++, j --);
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
		exchange: function (i, j)
		{
			var a = this .array [i];
			this .array [i] = this .array [j];
			this .array [j] = a;
		},
	};

	return QuickSort;
});
