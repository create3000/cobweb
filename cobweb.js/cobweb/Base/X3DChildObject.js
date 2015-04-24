
define ([
	"jquery",
	"cobweb/Base/X3DObject",
],
function ($, X3DObject)
{
	function X3DChildObject ()
	{
		X3DObject .call (this);

		this .parents = { };
	}

	X3DChildObject .prototype = $.extend (Object .create (X3DObject .prototype),
	{
		constructor: X3DChildObject,
		addParent: function (parent)
		{
			this .parents [parent .getId ()] = parent;
		},
		removeParent: function (parent)
		{
			delete this .parents [parent .getId ()];
		},
		getParents: function ()
		{
			return this .parents;
		},
	});

	return X3DChildObject;
});
