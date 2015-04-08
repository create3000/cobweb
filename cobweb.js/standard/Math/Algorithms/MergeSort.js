
define (function ()
{
	function MergeSort (array, compare)
	{
		this .array     = array;
		this .auxiliary = [ ];

		if (compare)
			this .compare = compare;
	}

	MergeSort .prototype =
	{
		compare: function (lhs, rhs)
		{
			return lhs < rhs;
		},
		sort: function (first, last)
		{
			this .mergeSort (first, last - 1);
		},
		mergeSort: function (lo, hi)
		{
			if (lo < hi)
			{
				var m = (lo + hi) >>> 1;
				this .mergeSort (lo, m);   // Recursion
				this .mergeSort (m + 1, hi); // Recursion
				this .merge (lo, m, hi);
			}
		},
		merge: function (lo, m, hi)
		{
			var i, j, k;

			i = 0, j = lo;
			// Copy first half of array a to auxiliary array b.
			while (j <= m)
				this .auxiliary [i++] = this .array [j++];

			i = 0; k = lo;
			// Copy back next-greatest element at each time.
			while (k < j && j <= hi)
			{
				if (this .compare (this .array [j], this .auxiliary [i]))
					this .array [k++] = this .array [j++];
				else
					this .array [k++] = this .auxiliary [i++];
			}

			// Copy back remaining elements of first half (if any).
			while (k < j)
				this .array [k++] = this .auxiliary [i++];
		}
	};

	return MergeSort;
});
