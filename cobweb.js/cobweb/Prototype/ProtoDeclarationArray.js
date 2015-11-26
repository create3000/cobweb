
define ([
	"jquery",
],
function ($)
{
"use strict";

	var handler =
	{
		get: function (target, key)
		{
			if (key in target)
				return target [key];

			if (parseInt (key) == key)
				return target .array [key];

			return target .index [key];
		},
		set: function (target, key, value)
		{
			var X3DProtoDeclaration = require ("cobweb/Prototype/X3DProtoDeclaration");
		
			if (value instanceof X3DProtoDeclaration)
			{
				target .array [key] = value;
				target .index       = { };

				for (var i = 0; i < target .array .length; ++ i)
				{
					var proto = target .array [i];
					target .index [proto .getName ()] = proto;
				}

				return true;
			}

			return false;
		},
	};

	function ProtoDeclarationArray ()
	{
		this .array = [ ];
		this .index = { };

		return new Proxy (this, handler);
	}

	$.extend (ProtoDeclarationArray .prototype,
	{
		constructor: ProtoDeclarationArray,
		push: function (value)
		{
			var X3DProtoDeclaration = require ("cobweb/Prototype/X3DProtoDeclaration");

			if (value instanceof X3DProtoDeclaration)
			{
				this .index [value .getName ()] = value;
				return this .array .push (value);
			}

			return this .array .length;
		},
	});

	Object .defineProperty (ProtoDeclarationArray .prototype, "length",
	{
		get: function () { return this .array .length; },
		enumerable: false,
		configurable: false
	});

	return ProtoDeclarationArray;
});
