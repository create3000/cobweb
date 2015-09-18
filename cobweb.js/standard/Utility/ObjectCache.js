
define (function ()
{
   return function (Type)
   {
	   return {
	      stack: [ ],
	      last: -1,
	      pop: function ()
	      {
				if (this .last > -1)
				{
					var object = this .stack [this .last];
				
					object .set .apply (object, arguments);

					this .last --;
				}
				else
				{
					var object = Object .create (Type .prototype);

					Type .apply (object, arguments);
				}

	         return object;
	      },
			push: function (object)
	      {
	         this .last ++;
	         this .stack [this .last] = object;
	      },
			clear: function ()
			{
			   this .stack .length = 0;
			   this .last          = -1;
			},
	   };
   };
});

