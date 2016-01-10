
define ([
	"jquery",
	"cobweb/Base/X3DObject",
],
function ($, X3DObject)
{
"use strict";

	function X3DChildObject ()
	{
		X3DObject .call (this);

		this ._parents = { };
	}

	X3DChildObject .prototype = $.extend (Object .create (X3DObject .prototype),
	{
		constructor: X3DChildObject,
		addEvent: function ()
		{
			var parents = this ._parents;

			for (var key in parents)
				parents [key] .addEvent (this);
		},
		addEventObject: function (field, event)
		{
			var parents = this ._parents;

			for (var key in parents)
				parents [key] .addEventObject (this, event);
		},
		addParent: function (parent)
		{
			this ._parents [parent .getId ()] = parent;
		},
		removeParent: function (parent)
		{
			delete this ._parents [parent .getId ()];
		},
		getParents: function ()
		{
			return this ._parents;
		},
	});

	return X3DChildObject;
});
