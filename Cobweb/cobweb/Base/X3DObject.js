
define ([
],
function ()
{
	/*
	 *  Id
	 */

	var id = 0;

	/*
	 *  X3DObject
	 */

	function X3DObject () { }

	X3DObject .prototype =
	{
		constructor: X3DObject,
		id_: undefined,
		name_: "",
		tainted_: false,
		interests_: { },
		getId: function ()
		{
			var id_ = ++ id;
		
			if (! this .hasOwnProperty ("getId"))
				this .getId = function () { return id_; };

			return id_;
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

			this .interests_ [object .getId () + callback] = object [callback] .bind (object);
		},
		removeInterest: function (object, callback)
		{
			delete this .interests_ [object .getId () + callback];
		},
		processInterests: function ()
		{
			for (var key in this .interests_)
				this .interests_ [key] (this);
		},
	};

	return X3DObject;
});
