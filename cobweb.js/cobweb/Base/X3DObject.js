
define ([
],
function ()
{
"use strict";

	/*
	 *  Id
	 */

	var id = 0;
	
	function getId () { return this .id_; }

	/*
	 *  X3DObject
	 */

	function X3DObject () { }

	X3DObject .prototype =
	{
		constructor: X3DObject,
		id_: 0,
		name_: "",
		tainted_: false,
		interests_: { },
		getId: function ()
		{
			this .getId = getId;

			return this .id_ = ++ id;
		},
		setName: function (value)
		{
			this .name_ = value;
		},
		getName: function ()
		{
			return this .name_;
		},
		setTainted: function (value)
		{
			this .tainted_ = value;
		},
		getTainted: function ()
		{
			return this .tainted_;
		},
		addInterest: function (object, callback)
		{
			if (! this .hasOwnProperty ("interests_"))
				this .interests_ = { };

			var args = Array .prototype .slice .call (arguments, 0);
	
			args [1] = this;

			this .interests_ [object .getId () + callback] = Function .prototype .bind .apply (object [callback], args);
		},
		removeInterest: function (object, callback)
		{
			delete this .interests_ [object .getId () + callback];
		},
		getInterests: function ()
		{
			return this .interests_;
		},
		processInterests: function ()
		{
			var interests = this .interests_;

			for (var key in interests)
				interests [key] ();
		},
	};

	return X3DObject;
});
