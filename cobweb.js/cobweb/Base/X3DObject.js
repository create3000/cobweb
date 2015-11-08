
define ([
],
function ()
{
"use strict";

	/*
	 *  Id
	 */

	var id = 0;
	
	function getId () { return this .id; }

	/*
	 *  X3DObject
	 */

	function X3DObject () { }

	X3DObject .prototype =
	{
		constructor: X3DObject,
		id: 0,
		name: "",
		tainted: false,
		interests: { },
		getId: function ()
		{
			this .getId = getId;

			return this .id = ++ id;
		},
		setName: function (value)
		{
			this .name = value;
		},
		getName: function ()
		{
			return this .name;
		},
		setTainted: function (value)
		{
			this .tainted = value;
		},
		getTainted: function ()
		{
			return this .tainted;
		},
		addInterest: function (object, callback)
		{
			if (! this .hasOwnProperty ("interests"))
				this .interests = { };

			var args = Array .prototype .slice .call (arguments, 0);
	
			args [1] = this;

			this .interests [object .getId () + callback] = Function .prototype .bind .apply (object [callback], args);
		},
		removeInterest: function (object, callback)
		{
			delete this .interests [object .getId () + callback];
		},
		getInterests: function ()
		{
			return this .interests;
		},
		processInterests: function ()
		{
			var interests = this .interests;

			for (var key in interests)
				interests [key] ();
		},
	};

	return X3DObject;
});
