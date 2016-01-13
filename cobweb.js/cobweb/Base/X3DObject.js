
define ([
],
function ()
{
"use strict";

	/*
	 *  Id
	 */

	var id = 0;
	
	function getId () { return this ._id; }

	/*
	 *  X3DObject
	 */

	function X3DObject () { }

	X3DObject .prototype =
	{
		constructor: X3DObject,
		_id: 0,
		_name: "",
		_tainted: false,
		_interests: { },
		getId: function ()
		{
			this .getId = getId;

			return this ._id = ++ id;
		},
		setName: function (value)
		{
			this ._name = value;
		},
		getName: function ()
		{
			return this ._name;
		},
		setTainted: function (value)
		{
			this ._tainted = value;
		},
		getTainted: function ()
		{
			return this ._tainted;
		},
		addInterest: function (object, callback)
		{
			if (! this .hasOwnProperty ("_interests"))
				this ._interests = { };

			var args = Array .prototype .slice .call (arguments, 0);
	
			args [1] = this;

			this ._interests [object .getId () + callback] = Function .prototype .bind .apply (object [callback], args);
		},
		removeInterest: function (object, callback)
		{
			delete this ._interests [object .getId () + callback];
		},
		getInterests: function ()
		{
			return this ._interests;
		},
		processInterests: function ()
		{
			var interests = this ._interests;

			for (var key in interests)
				interests [key] ();
		},
		dispose: function () { },
	};

	return X3DObject;
});
