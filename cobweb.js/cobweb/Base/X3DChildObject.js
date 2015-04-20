
define ([
	"jquery",
	"cobweb/Base/X3DObject",
],
function ($, X3DObject)
{
	function X3DChildObject ()
	{
		X3DObject .call (this);

		this .parents_ = { };
	}

	X3DChildObject .prototype = $.extend (Object .create (X3DObject .prototype),
	{
		constructor: X3DChildObject,
		addParent: function (parent)
		{
			this .parents_ [parent .getId ()] = parent;
		},
		removeParent: function (parent)
		{
			delete this .parents_ [parent .getId ()];
		},
		getParents: function ()
		{
			return this .parents_;
		},
	});

	return X3DChildObject;
});
