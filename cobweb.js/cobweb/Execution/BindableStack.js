
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
],
function ($, X3DBaseNode)
{
"use strict";

	function BindableStack (executionContext, layer, defaultNode)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		this .layer = layer;
		this .array = [ defaultNode ];
	}

	BindableStack .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		get: function ()
		{
			return this .array;
		},
		top: function ()
		{
			return this .array [this .array .length - 1];
		},
		forcePush: function (node)
		{
			node .isBound_  = true;
			node .bindTime_ = this .getBrowser () .getCurrentTime ();

			this .push (node);
		},
		push: function (node)
		{
			if (node === this .array [0])
				return;
			
			var top = this .top ();
			
			if (node !== top)
			{
				if (top .isBound_ .getValue ())
				{
					top .set_bind_ = false;
					top .isBound_  = false;
				}

				this .pushOnTop (node);

				if (! node .isBound_ .getValue ())
				{
					node .isBound_  = true;
					node .bindTime_ = this .getBrowser () .getCurrentTime ();
					node .transitionStart (this .layer, top);
				}

				this .addNodeEvent ();
			}
		},
		pushOnTop: function (node)
		{
			var index = this .array .indexOf (node);

			if (index > -1)
				this .array .splice (index, 1);

			this .array .push (node);
		},
		remove: function (node)
		{
			if (node === this .array [0])
				return;

			// If on top, pop node.

			var top = this .top ();

			if (node === top)
				return this .pop (node);

			// Simply remove.

			var index = this .array .indexOf (node);

			if (index > -1)
				this .array .splice (index, 1);
		},
		pop: function (node)
		{
			if (node === this .array [0])
				return;

			var top = this .top ();
			
			if (node === top)
			{
				if (node .isBound_ .getValue ())
					node .isBound_ = false;

				this .array .pop ();

				top = this .top ();

				if (! top .isBound_ .getValue ())
				{
					top .set_bind_ = true;
					top .isBound_  = true;
					top .bindTime_ = this .getBrowser () .getCurrentTime ();
					top .transitionStart (this .layer, node);
				}

				this .addNodeEvent ();
			}
		},
	});

	return BindableStack;
});